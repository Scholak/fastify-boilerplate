import { PrismaClient } from '@prisma/client'
import { Redis } from 'ioredis'
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
  photo: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
  updatedById: true,
} as const

export class UsersService {
  constructor(
    private prisma: PrismaClient,
    private redis: Redis,
  ) {}

  private cacheKey(id: string) {
    return `${USER_CACHE_PREFIX}${id}`
  }

  async findAll() {
    const cached = await this.redis.get(USERS_LIST_KEY)
    if (cached) return JSON.parse(cached)

    const users = await this.prisma.user.findMany({
      select: safeFields,
      orderBy: { createdAt: 'desc' },
    })

    await this.redis.set(USERS_LIST_KEY, JSON.stringify(users), 'EX', config.redis.ttl)
    return users
  }

  async findById(id: string) {
    const cached = await this.redis.get(this.cacheKey(id))
    if (cached) return JSON.parse(cached)

    const user = await this.prisma.user.findUnique({ where: { id }, select: safeFields })

    if (user) {
      await this.redis.set(this.cacheKey(id), JSON.stringify(user), 'EX', config.redis.ttl)
    }

    return user
  }

  async create(data: TCreateUserSchema, createdById?: string) {
    const passwordHash = await hashPassword(data.password)

    const user = await this.prisma.user.create({
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

    await this.invalidateListCache()
    return user
  }

  async update(id: string, data: TUpdateUserSchema, updatedById?: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { ...data, updatedById },
      select: safeFields,
    })

    await this.invalidateCache(id)
    return user
  }

  async delete(id: string) {
    const user = await this.prisma.user.delete({ where: { id } })
    await this.invalidateCache(id)

    return user
  }

  private async invalidateCache(id: string) {
    await this.redis.del(this.cacheKey(id))
    await this.invalidateListCache()
  }

  private async invalidateListCache() {
    await this.redis.del(USERS_LIST_KEY)
  }
}
