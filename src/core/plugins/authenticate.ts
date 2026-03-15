import { FastifyRequest, FastifyReply } from 'fastify'
import { fail } from '@/core/lib/response'
import { errorCodes } from '@/core/lib/errors'
import { verifyAccessToken } from '@/core/lib/jwt'

/**
 * Fastify `preHandler` hook that enforces JWT authentication.
 *
 * Reads the `Authorization: Bearer <token>` header, verifies it with jose,
 * fetches the matching user from the database, and sets `request.currentUser`.
 * Responds with 401 if the token is missing, invalid, or the user no longer exists.
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
      omit: {
        passwordHash: true,
      },
    })

    if (!user) {
      return reply.status(401).send(fail(errorCodes.UNAUTHORIZED, 'User not found'))
    }

    request.currentUser = user
  } catch {
    return reply.status(401).send(fail(errorCodes.UNAUTHORIZED, 'Invalid or expired token'))
  }
}
