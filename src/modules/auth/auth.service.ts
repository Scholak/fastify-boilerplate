import { PrismaClient } from '@prisma/client'
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

/** Handles all authentication-related database and email operations. */
export class AuthService {
  constructor(private prisma: PrismaClient) {}

  /** Finds a user by their email address. Returns `null` if not found. */
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  /** Finds a user by their primary key. Returns `null` if not found. */
  async findUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  /**
   * Finds a user that owns a valid (non-expired) reset token.
   * Returns `null` if the token is invalid or has expired.
   */
  async findUserByResetToken(token: string) {
    return this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    })
  }

  /** Validates a plain-text password against a stored bcrypt hash. */
  async validatePassword(password: string, hash: string) {
    return comparePassword(password, hash)
  }

  /**
   * Generates a cryptographically random reset token, stores it on the user,
   * and sets a 1-hour expiry window.
   *
   * @returns The plain-text reset token to be sent via email.
   */
  async generateResetToken(userId: string) {
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await this.prisma.user.update({
      where: { id: userId },
      data: { resetToken, resetTokenExpiry },
    })

    return resetToken
  }

  /**
   * Sends a password-reset email containing a link with the reset token.
   * Uses the HTML template from `templates/reset-password.html`.
   */
  async sendPasswordResetEmail(email: string, firstName: string, resetToken: string) {
    const resetLink = `${config.appUrl}/reset-password?token=${resetToken}`
    const html = resetPasswordTemplate({ firstName, resetLink })

    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html,
      text: `Hi ${firstName},\n\nReset your password: ${resetLink}\n\nThis link expires in 1 hour.`,
    })
  }

  /**
   * Hashes the new password, saves it, and clears the reset token fields.
   */
  async resetPassword(userId: string, newPassword: string) {
    const passwordHash = await hashPassword(newPassword)
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, resetToken: null, resetTokenExpiry: null },
    })
  }

  /** Updates the authenticated user's profile fields (firstName, lastName, email). */
  async updateProfileData(userId: string, data: TUpdateProfileSchema) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: safeFields,
    })
  }

}
