import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import Redis from 'ioredis'
import { config } from '@/core/config'

/**
 * Fastify plugin that creates an ioredis client using credentials from config,
 * decorates the instance as `fastify.redis`, and quits the connection on
 * server shutdown.
 */
const redisPlugin: FastifyPluginAsync = async (fastify) => {
  const redis = new Redis(config.redis.url, {
    // Pass credentials only when provided — avoids ioredis auth errors on
    // servers that require no authentication.
    username: config.redis.username || undefined,
    password: config.redis.password || undefined,
  })

  redis.on('error', (err) => fastify.log.error({ err }, 'Redis connection error'))

  fastify.decorate('redis', redis)

  fastify.addHook('onClose', async () => {
    await redis.quit()
  })
}

export default fp(redisPlugin)
