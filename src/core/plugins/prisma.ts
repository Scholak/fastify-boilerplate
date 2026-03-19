import { PrismaClient } from '@prisma/client'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

/**
 * Fastify plugin that initialises PrismaClient, decorates the instance as
 * `fastify.prisma`, and gracefully disconnects on server shutdown.
 */
const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient()
  await prisma.$connect()

  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect()
  })
}

export default fp(prismaPlugin)
