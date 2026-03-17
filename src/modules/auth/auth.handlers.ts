import { FastifyRequest, FastifyReply } from 'fastify'
import { ok, fail } from '@/core/lib/response'
import { errorCodes } from '@/core/lib/errors'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/core/lib/jwt'
import { config } from '@/core/config'
import {
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '@/modules/auth/auth.schemas'
import * as authService from '@/modules/auth/auth.service'
import { responseMessages } from '@/modules/auth/auth.constants'
import type {
  TSignInRequest,
  TForgotPasswordRequest,
  TResetPasswordRequest,
  TUpdateProfileRequest,
  TChangePasswordRequest,
} from '@/modules/auth/auth.types'

export const signIn = async (request: TSignInRequest, reply: FastifyReply) => {
  const result = signInSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send(fail(errorCodes.VALIDATION_ERROR, ''))
  }

  const { email, password } = result.data
  const user = await authService.findUserByEmail(email)

  if (!user) {
    return reply
      .status(401)
      .send(fail(errorCodes.INVALID_CREDENTIALS, responseMessages.INVALID_CREDENTIALS))
  }

  const valid = await authService.validatePassword(password, user.passwordHash)
  if (!valid) {
    return reply
      .status(401)
      .send(fail(errorCodes.INVALID_CREDENTIALS, responseMessages.INVALID_CREDENTIALS))
  }

  const accessToken = await signAccessToken({ userId: user.id, email: user.email })
  const refreshToken = await signRefreshToken({ userId: user.id, email: user.email })

  return reply
    .setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
    })
    .send(
      ok(
        {
          accessToken,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        },
        responseMessages.SIGNED_IN,
      ),
    )
}

export const forgotPassword = async (request: TForgotPasswordRequest, reply: FastifyReply) => {
  const result = forgotPasswordSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send(fail(errorCodes.VALIDATION_ERROR, ''))
  }

  const user = await authService.findUserByEmail(result.data.email)

  if (!user) {
    return reply.send(ok(null, responseMessages.RESET_LINK_SENT))
  }

  const resetToken = await authService.generateResetToken(user.id)
  await authService.sendPasswordResetEmail(user.email, user.firstName, resetToken)

  return reply.send(ok(null, responseMessages.RESET_LINK_SENT))
}

export const resetPassword = async (request: TResetPasswordRequest, reply: FastifyReply) => {
  const result = resetPasswordSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send(fail(errorCodes.VALIDATION_ERROR, ''))
  }

  const { token, newPassword } = result.data
  const user = await authService.findUserByResetToken(token)

  if (!user) {
    return reply.status(400).send(fail(errorCodes.INVALID_TOKEN, responseMessages.INVALID_TOKEN))
  }

  await authService.resetPassword(user.id, newPassword)
  return reply.send(ok(null, responseMessages.PASSWORD_RESET))
}

export const getToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const refreshToken = request.cookies?.refreshToken

  if (!refreshToken)
    return reply.status(401).send(fail(errorCodes.UNAUTHORIZED, responseMessages.NO_REFRESH_TOKEN))

  try {
    const payload = await verifyRefreshToken(refreshToken)
    const user = await authService.findUserById(payload.userId)

    if (!user) {
      return reply
        .status(401)
        .send(fail(errorCodes.UNAUTHORIZED, responseMessages.INVALID_REFRESH_TOKEN))
    }

    const accessToken = await signAccessToken({ userId: user.id, email: user.email })
    return reply.send(ok({ accessToken }, responseMessages.TOKEN_REFRESHED))
  } catch {
    return reply
      .status(401)
      .send(fail(errorCodes.UNAUTHORIZED, responseMessages.INVALID_EXPIRED_REFRESH_TOKEN))
  }
}

export const me = async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.send(ok(request.currentUser, responseMessages.CURRENT_USER))
}

export const updateProfile = async (request: TUpdateProfileRequest, reply: FastifyReply) => {
  const result = updateProfileSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send(fail(errorCodes.VALIDATION_ERROR, ''))
  }

  const user = await authService.updateProfileData(request.currentUser.id, result.data)
  return reply.send(ok(user, responseMessages.PROFILE_UPDATED))
}

export const changePassword = async (request: TChangePasswordRequest, reply: FastifyReply) => {
  const result = changePasswordSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send(fail(errorCodes.VALIDATION_ERROR, ''))
  }

  const { currentPassword, newPassword } = result.data

  const user = await authService.findUserById(request.currentUser.id)
  if (!user) {
    return reply.status(401).send(fail(errorCodes.UNAUTHORIZED, 'User not found'))
  }

  const valid = await authService.validatePassword(currentPassword, user.passwordHash)
  if (!valid) {
    return reply
      .status(400)
      .send(fail(errorCodes.VALIDATION_ERROR, responseMessages.INVALID_CURRENT_PASSWORD))
  }

  await authService.resetPassword(user.id, newPassword)
  return reply.send(ok(null, responseMessages.PASSWORD_CHANGED))
}
