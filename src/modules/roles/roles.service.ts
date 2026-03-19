import { fastify } from '@/app'

import type { TCreateRoleSchema, TUpdateRoleSchema } from '@/modules/roles/roles.schemas'

function formatRole(role: {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  permissions: Array<{ permissionKey: string }>
}) {
  return {
    id: role.id,
    name: role.name,
    permissions: role.permissions.map((p) => p.permissionKey),
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  }
}

export async function findAll() {
  const roles = await fastify.prisma.role.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return roles.map((r) => ({
    id: r.id,
    name: r.name,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }))
}

export async function findById(id: string) {
  const role = await fastify.prisma.role.findUnique({
    where: { id },
    include: { permissions: true },
  })
  if (!role) return null
  return formatRole(role)
}

export async function create(data: TCreateRoleSchema) {
  const role = await fastify.prisma.role.create({
    data: {
      name: data.name,
      permissions: {
        create: data.permissions.map((key) => ({ permissionKey: key })),
      },
    },
    include: { permissions: true },
  })
  return formatRole(role)
}

export async function update(id: string, data: TUpdateRoleSchema) {
  const role = await fastify.prisma.role.update({
    where: { id },
    data: {
      name: data.name,
      permissions: {
        deleteMany: {},
        create: data.permissions.map((key) => ({ permissionKey: key })),
      },
    },
    include: { permissions: true },
  })
  return formatRole(role)
}

export async function remove(id: string) {
  return fastify.prisma.role.delete({ where: { id } })
}
