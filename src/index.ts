import { createApp, registerPlugins } from '@/core/bootstrap'
import { authRoutes } from '@/modules/auth/auth.routes'
import { usersRoutes } from '@/modules/users/users.routes'
import { config } from '@/core/config'

async function start() {
  const fastify = createApp()
  await registerPlugins(fastify)
  await fastify.register(authRoutes, { prefix: '/api' })
  await fastify.register(usersRoutes, { prefix: '/api' })

  fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' })
    fastify.log.info(`Server running on port ${config.port}`)
    fastify.log.info(`API docs available at http://localhost:${config.port}/docs`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
