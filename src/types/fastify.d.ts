export {}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: import('@prisma/client').PrismaClient
    redis: import('ioredis').default
  }

  // Fix: 'tags' does not exist in type 'FastifySchema'
  interface FastifySchema {
    tags?: string[]
    summary?: string
    description?: string
    security?: Array<Record<string, string[]>>
    consumes?: string[]
  }

  interface FastifyRequest {
    currentUser: {
      id: string
      firstName: string
      lastName: string
      email: string
      createdAt: Date
      updatedAt: Date
    }
  }
}
