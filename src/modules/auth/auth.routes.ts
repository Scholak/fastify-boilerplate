import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticate } from '@/core/plugins/authenticate'
import { authRateLimits } from '@/modules/auth/auth.config'
import {
  signIn,
  forgotPassword,
  resetPassword,
  getToken,
  me,
  updateProfile,
  changePassword,
  updateProfilePhoto,
  deleteProfilePhoto,
} from '@/modules/auth/auth.handlers'
import {
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  changeProfilePhotoSchema,
  authUserSchema,
  currentUserSchema,
} from '@/modules/auth/auth.schemas'
import { errorResponseSchema, apiResponse } from '@/core/lib/schemas'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/auth/sign-in',
    {
      config: { rateLimit: authRateLimits.signIn },
      schema: {
        tags: ['Auth'],
        summary: 'Sign in with email and password',
        body: signInSchema,
        response: {
          200: apiResponse(
            z.object({
              accessToken: z.string().describe('JWT access token (expires in 15 min)'),
              refreshToken: z.string().describe('JWT refresh token (expires in 7 days)'),
              user: authUserSchema,
            }),
          ),
          400: errorResponseSchema,
          401: errorResponseSchema,
          429: errorResponseSchema,
        },
      },
    },
    signIn,
  )

  fastify.post(
    '/auth/forgot-password',
    {
      config: { rateLimit: authRateLimits.forgotPassword },
      schema: {
        tags: ['Auth'],
        summary: 'Request a password reset link via email',
        body: forgotPasswordSchema,
        response: {
          200: apiResponse(z.null()),
          400: errorResponseSchema,
          429: errorResponseSchema,
        },
      },
    },
    forgotPassword,
  )

  fastify.post(
    '/auth/reset-password',
    {
      config: { rateLimit: authRateLimits.resetPassword },
      schema: {
        tags: ['Auth'],
        summary: 'Reset password using a reset token',
        body: resetPasswordSchema,
        response: {
          200: apiResponse(z.null()),
          400: errorResponseSchema,
          429: errorResponseSchema,
        },
      },
    },
    resetPassword,
  )

  fastify.get(
    '/auth/get-token',
    {
      config: { rateLimit: authRateLimits.getToken },
      schema: {
        tags: ['Auth'],
        summary: 'Get a new access token using a refresh token',
        description: 'Pass the refresh token in the Authorization header as a Bearer token.',
        security: [{ bearerAuth: [] }],
        response: {
          200: apiResponse(
            z.object({
              accessToken: z.string().describe('New JWT access token (expires in 15 min)'),
            }),
          ),
          401: errorResponseSchema,
          429: errorResponseSchema,
        },
      },
    },
    getToken,
  )

  fastify.get(
    '/auth/me',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Auth'],
        summary: 'Get the currently authenticated user',
        security: [{ bearerAuth: [] }],
        response: {
          200: apiResponse(currentUserSchema),
          401: errorResponseSchema,
        },
      },
    },
    me,
  )

  fastify.put(
    '/auth/profile',
    {
      preHandler: authenticate,
      config: { rateLimit: authRateLimits.updateProfile },
      schema: {
        tags: ['Auth'],
        summary: 'Update authenticated user profile',
        security: [{ bearerAuth: [] }],
        body: updateProfileSchema,
        response: {
          200: apiResponse(currentUserSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
        },
      },
    },
    updateProfile,
  )

  fastify.put(
    '/auth/profile/password',
    {
      preHandler: authenticate,
      config: { rateLimit: authRateLimits.changePassword },
      schema: {
        tags: ['Auth'],
        summary: 'Change authenticated user password',
        security: [{ bearerAuth: [] }],
        body: changePasswordSchema,
        response: {
          200: apiResponse(z.null()),
          400: errorResponseSchema,
          401: errorResponseSchema,
        },
      },
    },
    changePassword,
  )

  fastify.post(
    '/auth/profile/photo',
    {
      preHandler: authenticate,
      config: { rateLimit: authRateLimits.updateProfilePhoto },
      schema: {
        tags: ['Auth'],
        summary: 'Update authenticated user profile photo',
        security: [{ bearerAuth: [] }],
        consumes: ['multipart/form-data'],
        body: changeProfilePhotoSchema,
        response: {
          200: apiResponse(currentUserSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
        },
      },
    },
    updateProfilePhoto,
  )

  fastify.delete(
    '/auth/profile/photo',
    {
      preHandler: authenticate,
      config: { rateLimit: authRateLimits.deleteProfilePhoto },
      schema: {
        tags: ['Auth'],
        summary: 'Delete authenticated user profile photo',
        security: [{ bearerAuth: [] }],
        response: {
          200: apiResponse(currentUserSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
        },
      },
    },
    deleteProfilePhoto,
  )
}
