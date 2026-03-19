import { FastifyRequest, FastifyReply } from 'fastify'

import { errorCodes } from '@/core/lib/errors'
import { verifyAccessToken } from '@/core/lib/jwt'
import { fail } from '@/core/lib/response'

/**
 * Fastify `preHandler` hook that enforces JWT authentication.
 *
 * Reads the `Authorization: Bearer <token>` header, verifies it with jose,
 * fetches the matching user from the database (including roles and permissions),
 * and sets `request.currentUser`. Responds with 401 if the token is missing,
 * invalid, or the user no longer exists.
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send(fail(errorCodes.UNAUTHORIZED, 'No token provided'))
  }

  try {
    const token = authHeader.slice(7)
    const payload = await verifyAccessToken(token)

    const user = await request.server.prisma.user.findUnique({
      where: { id: payload.userId },
      omit: { passwordHash: true, resetToken: true, resetTokenExpiry: true },
      include: {
        roles: {
          include: {
            role: {
              include: { permissions: true },
            },
          },
        },
      },
    })

    if (!user) {
      return reply.status(401).send(fail(errorCodes.UNAUTHORIZED, 'User not found'))
    }

    const roles = user.roles.map((ur) => ({
      id: ur.role.id,
      name: ur.role.name,
      permissions: ur.role.permissions.map((rp) => rp.permissionKey),
    }))

    const permissions = [...new Set(roles.flatMap((r) => r.permissions))]

    request.currentUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles,
      permissions,
    }
  } catch {
    return reply.status(401).send(fail(errorCodes.UNAUTHORIZED, 'Invalid or expired token'))
  }
}
