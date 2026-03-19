/// <reference types="node" />
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const ALL_PERMISSIONS = [
  'users.list',
  'users.detail',
  'users.create',
  'users.edit',
  'users.delete',
  'users.assign-roles',
  'roles.list',
  'roles.detail',
  'roles.create',
  'roles.edit',
  'roles.delete',
]

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 10)

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {
      permissions: {
        deleteMany: {},
        create: ALL_PERMISSIONS.map((key) => ({ permissionKey: key })),
      },
    },
    create: {
      name: 'Admin',
      permissions: {
        create: ALL_PERMISSIONS.map((key) => ({ permissionKey: key })),
      },
    },
  })

  console.log(`Seeded role: ${adminRole.name} (id: ${adminRole.id})`)

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      passwordHash,
    },
  })

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
    update: {},
    create: { userId: user.id, roleId: adminRole.id },
  })

  console.log(`Seeded user: ${user.email} (id: ${user.id})`)
  console.log(`Assigned role '${adminRole.name}' to user '${user.email}'`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
