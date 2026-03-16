import { fastify } from '@/app'
import { hashPassword } from '@/core/lib/password'
import { config } from '@/core/config'
import type { TCreateUserSchema, TUpdateUserSchema } from '@/modules/users/users.schemas'

const USER_CACHE_PREFIX = 'user:'
const USERS_LIST_KEY = 'users:list'

/** Excludes sensitive fields (passwordHash, resetToken, resetTokenExpiry) from query results. */
const safeFields = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
  updatedById: true,
} as const

function cacheKey(id: string) {
  return `${USER_CACHE_PREFIX}${id}`
}

async function invalidateListCache() {
  await fastify.redis.del(USERS_LIST_KEY)
}

async function invalidateCache(id: string) {
  await fastify.redis.del(cacheKey(id))
  await invalidateListCache()
}

export async function findAll() {
  const cached = await fastify.redis.get(USERS_LIST_KEY)
  if (cached) return JSON.parse(cached)

  const users = await fastify.prisma.user.findMany({
    select: safeFields,
    orderBy: { createdAt: 'desc' },
  })

  await fastify.redis.set(USERS_LIST_KEY, JSON.stringify(users), 'EX', config.redis.ttl)
  return users
}

export async function findById(id: string) {
  const cached = await fastify.redis.get(cacheKey(id))
  if (cached) return JSON.parse(cached)

  const user = await fastify.prisma.user.findUnique({ where: { id }, select: safeFields })

  if (user) {
    await fastify.redis.set(cacheKey(id), JSON.stringify(user), 'EX', config.redis.ttl)
  }

  return user
}

export async function create(data: TCreateUserSchema, createdById?: string) {
  const passwordHash = await hashPassword(data.password)

  const user = await fastify.prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      createdById,
      updatedById: createdById,
    },
    select: safeFields,
  })

  await invalidateListCache()
  return user
}

export async function update(id: string, data: TUpdateUserSchema, updatedById?: string) {
  const user = await fastify.prisma.user.update({
    where: { id },
    data: { ...data, updatedById },
    select: safeFields,
  })

  await invalidateCache(id)
  return user
}

export async function remove(id: string) {
  const user = await fastify.prisma.user.delete({ where: { id } })
  await invalidateCache(id)

  return user
}
