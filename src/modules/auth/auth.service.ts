import { fastify } from '@/app'
import { comparePassword, hashPassword } from '@/core/lib/password'
import { sendEmail } from '@/core/lib/email'
import { config } from '@/core/config'
import { resetPasswordTemplate } from '@/modules/auth/templates/reset-password.template'
import type { TUpdateProfileSchema } from '@/modules/auth/auth.schemas'
import crypto from 'crypto'

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

export async function findUserByEmail(email: string) {
  return fastify.prisma.user.findUnique({ where: { email } })
}

export async function findUserById(id: string) {
  return fastify.prisma.user.findUnique({ where: { id } })
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
  return fastify.prisma.user.update({
    where: { id: userId },
    data,
    select: safeFields,
  })
}
