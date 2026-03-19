import { FastifyPluginAsync, FastifyError } from 'fastify'
import fp from 'fastify-plugin'

import { errorCodes } from '@/core/lib/errors'
import { fail } from '@/core/lib/response'

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((err, request, reply) => {
    const error = err as FastifyError & { code?: string }

    // Fastify built-in validation errors
    if (error.validation) {
      return reply.status(400).send(fail(errorCodes.VALIDATION_ERROR, error.message))
    }

    // Rate limit — @fastify/rate-limit throws the errorResponseBuilder return value as
    // a plain object (no statusCode property), so check by code.
    if (error.statusCode === 429 || error.code === errorCodes.RATE_LIMIT_EXCEEDED) {
      return reply.status(429).send(fail(errorCodes.RATE_LIMIT_EXCEEDED, error.message))
    }

    // Known HTTP errors (4xx)
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      return reply.status(error.statusCode).send(fail(errorCodes.INTERNAL_ERROR, error.message))
    }

    // Unexpected errors
    fastify.log.error({ err: error, url: request.url, method: request.method }, 'Unhandled error')
    return reply.status(500).send(fail(errorCodes.INTERNAL_ERROR, 'Internal server error'))
  })
}

export default fp(errorHandlerPlugin)
