import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'

export default fp(async function multipartFieldsPlugin(fastify: FastifyInstance) {
  fastify.addHook('preValidation', async (request) => {
    if (!request.body || typeof request.body !== 'object') return

    const body = request.body as Record<string, any>
    for (const key of Object.keys(body)) {
      if (body[key]?.type === 'field') {
        body[key] = body[key].value
      }
    }
  })
})
