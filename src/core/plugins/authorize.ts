import { FastifyRequest, FastifyReply } from 'fastify'

import { errorCodes } from '@/core/lib/errors'
import { fail } from '@/core/lib/response'

export function authorize(requiredPermissions: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const userPermissions = request.currentUser?.permissions ?? []
    const hasAll = requiredPermissions.every((p) => userPermissions.includes(p))
    if (!hasAll) {
      return reply
        .status(403)
        .send(fail(errorCodes.FORBIDDEN, 'You do not have permission to perform this action'))
    }
  }
}
