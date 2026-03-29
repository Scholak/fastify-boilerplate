import { config } from '@/core/config'
import { hashPassword } from '@/core/lib/password'

import { fastify } from '@/app'

import type {
  TCreateUserSchema,
  TUpdateUserSchema,
  TAssignUserRolesSchema,
  TRevokeUserRolesSchema,
  TUpdateUserRolesSchema,
} from '@/modules/users/users.schemas'

const USER_CACHE_PREFIX = 'user:'
const USERS_LIST_KEY = 'users:list'

const safeFields = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
  updatedById: true,
  roles: {
    include: {
      role: {
        include: { permissions: true },
      },
    },
  },
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

function formatUser(user: {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: Date
  updatedAt: Date
  createdById: string | null
  updatedById: string | null
  roles: Array<{
    role: { id: string; name: string; permissions: Array<{ permissionKey: string }> }
  }>
}) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    createdById: user.createdById,
    updatedById: user.updatedById,
    roles: user.roles.map((ur) => ({
      id: ur.role.id,
      name: ur.role.name,
      permissions: ur.role.permissions.map((p) => p.permissionKey),
    })),
  }
}

export async function findAll() {
  const cached = await fastify.redis.get(USERS_LIST_KEY)
  if (cached) return JSON.parse(cached)

  const users = await fastify.prisma.user.findMany({
    select: safeFields,
    orderBy: { createdAt: 'desc' },
  })

  const formatted = users.map(formatUser)
  await fastify.redis.set(USERS_LIST_KEY, JSON.stringify(formatted), 'EX', config.redis.ttl)
  return formatted
}

export async function findById(id: string) {
  const cached = await fastify.redis.get(cacheKey(id))
  if (cached) return JSON.parse(cached)

  const user = await fastify.prisma.user.findUnique({ where: { id }, select: safeFields })
  if (!user) return null

  const formatted = formatUser(user)
  await fastify.redis.set(cacheKey(id), JSON.stringify(formatted), 'EX', config.redis.ttl)
  return formatted
}

export async function findByIdForEdit(id: string) {
  return findById(id)
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
  return formatUser(user)
}

export async function update(id: string, data: TUpdateUserSchema, updatedById?: string) {
  const user = await fastify.prisma.user.update({
    where: { id },
    data: { ...data, updatedById },
    select: safeFields,
  })

  await invalidateCache(id)
  return formatUser(user)
}

export async function remove(id: string) {
  const user = await fastify.prisma.user.delete({ where: { id } })
  await invalidateCache(id)
  return user
}

export async function findUserRoles(id: string) {
  const user = await fastify.prisma.user.findUnique({
    where: { id },
    select: {
      roles: {
        include: {
          role: {
            include: { permissions: true },
          },
        },
      },
    },
  })
  if (!user) return null
  return user.roles.map((ur) => ({
    id: ur.role.id,
    name: ur.role.name,
    permissions: ur.role.permissions.map((p) => p.permissionKey),
  }))
}

export async function updateRoles(userId: string, data: TUpdateUserRolesSchema) {
  await fastify.prisma.$transaction([
    fastify.prisma.userRole.deleteMany({ where: { userId } }),
    ...(data.roleIds.length > 0
      ? [
          fastify.prisma.userRole.createMany({
            data: data.roleIds.map((roleId) => ({ userId, roleId })),
            skipDuplicates: true,
          }),
        ]
      : []),
  ])
  await invalidateCache(userId)
}

export async function assignRoles(userId: string, data: TAssignUserRolesSchema) {
  await fastify.prisma.userRole.createMany({
    data: data.roleIds.map((roleId) => ({ userId, roleId })),
    skipDuplicates: true,
  })
  await invalidateCache(userId)
}

export async function revokeRoles(userId: string, data: TRevokeUserRolesSchema) {
  await fastify.prisma.userRole.deleteMany({
    where: { userId, roleId: { in: data.roleIds } },
  })
  await invalidateCache(userId)
}
