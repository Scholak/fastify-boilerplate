import crypto from 'crypto'

import { config } from '@/core/config'
import { sendEmail } from '@/core/lib/email'
import { comparePassword, hashPassword } from '@/core/lib/password'

import { fastify } from '@/app'

import type { TUpdateProfileSchema } from '@/modules/auth/auth.schemas'
import { resetPasswordTemplate } from '@/modules/auth/templates/reset-password.template'


export async function findUserByEmail(email: string) {
  return fastify.prisma.user.findUnique({ where: { email } })
}

export async function findUserById(id: string) {
  return fastify.prisma.user.findUnique({ where: { id } })
}

export async function findUserWithRoles(id: string) {
  const user = await fastify.prisma.user.findUnique({
    where: { id },
    omit: { passwordHash: true, resetToken: true, resetTokenExpiry: true },
    include: {
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

  const roles = user.roles.map((ur) => ({
    id: ur.role.id,
    name: ur.role.name,
    permissions: ur.role.permissions.map((rp) => rp.permissionKey),
  }))
  const permissions = [...new Set(roles.flatMap((r) => r.permissions))]

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles,
    permissions,
  }
}

export async function findUserByResetToken(token: string) {
  return fastify.prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  })
}

export async function validatePassword(password: string, hash: string) {
  return comparePassword(password, hash)
}

export async function generateResetToken(userId: string) {
  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

  await fastify.prisma.user.update({
    where: { id: userId },
    data: { resetToken, resetTokenExpiry },
  })

  return resetToken
}

export async function sendPasswordResetEmail(email: string, firstName: string, resetToken: string) {
  const resetLink = `${config.appUrl}/reset-password?token=${resetToken}`
  const html = resetPasswordTemplate({ firstName, resetLink })

  await sendEmail({
    to: email,
    subject: 'Reset your password',
    html,
    text: `Hi ${firstName},\n\nReset your password: ${resetLink}\n\nThis link expires in 1 hour.`,
  })
}

export async function resetPassword(userId: string, newPassword: string) {
  const passwordHash = await hashPassword(newPassword)
  return fastify.prisma.user.update({
    where: { id: userId },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  })
}

export async function updateProfileData(userId: string, data: TUpdateProfileSchema) {
  const user = await fastify.prisma.user.update({
    where: { id: userId },
    data,
    omit: { passwordHash: true, resetToken: true, resetTokenExpiry: true },
    include: {
      roles: {
        include: {
          role: {
            include: { permissions: true },
          },
        },
      },
    },
  })

  const roles = user.roles.map((ur) => ({
    id: ur.role.id,
    name: ur.role.name,
    permissions: ur.role.permissions.map((rp) => rp.permissionKey),
  }))
  const permissions = [...new Set(roles.flatMap((r) => r.permissions))]

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles,
    permissions,
  }
}
