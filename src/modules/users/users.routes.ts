import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticate } from '@/core/plugins/authenticate'
import { usersRateLimits } from '@/modules/users/users.config'
import {
  list,
  getOne,
  create,
  update,
  remove,
} from '@/modules/users/users.handlers'
import {
  createUserSchema,
  updateUserSchema,
  userIdParamsSchema,
  userResponseSchema,
} from '@/modules/users/users.schemas'
import { errorResponseSchema, apiResponse } from '@/core/lib/schemas'

export async function usersRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/users',
    {
      preHandler: authenticate,
      config: { rateLimit: usersRateLimits.list },
      schema: {
        tags: ['Users'],
        summary: 'List all users',
        security: [{ bearerAuth: [] }],
        response: {
          200: apiResponse(z.array(userResponseSchema)),
          401: errorResponseSchema,
        },
      },
    },
    list,
  )

  fastify.get(
    '/users/:userId',
    {
      preHandler: authenticate,
      config: { rateLimit: usersRateLimits.getOne },
      schema: {
        tags: ['Users'],
        summary: 'Get a user by ID',
        security: [{ bearerAuth: [] }],
        params: userIdParamsSchema,
        response: {
          200: apiResponse(userResponseSchema),
          401: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getOne,
  )

  fastify.post(
    '/users',
    {
      preHandler: authenticate,
      config: { rateLimit: usersRateLimits.create },
      schema: {
        tags: ['Users'],
        summary: 'Create a new user',
        security: [{ bearerAuth: [] }],
        body: createUserSchema,
        response: {
          201: apiResponse(userResponseSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    create,
  )

  fastify.put(
    '/users/:userId',
    {
      preHandler: authenticate,
      config: { rateLimit: usersRateLimits.update },
      schema: {
        tags: ['Users'],
        summary: 'Update a user',
        security: [{ bearerAuth: [] }],
        params: userIdParamsSchema,
        body: updateUserSchema,
        response: {
          200: apiResponse(userResponseSchema),
          400: errorResponseSchema,
          401: errorResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    update,
  )

  fastify.delete(
    '/users/:userId',
    {
      preHandler: authenticate,
      config: { rateLimit: usersRateLimits.remove },
      schema: {
        tags: ['Users'],
        summary: 'Delete a user',
        security: [{ bearerAuth: [] }],
        params: userIdParamsSchema,
        response: {
          200: apiResponse(z.null()),
          401: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    remove,
  )

}
