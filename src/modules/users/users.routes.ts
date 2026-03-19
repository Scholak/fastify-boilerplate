import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { PERMISSIONS } from '@/core/lib/permissions'
import { errorResponseSchema, apiResponse } from '@/core/lib/schemas'
import { authenticate } from '@/core/plugins/authenticate'
import { authorize } from '@/core/plugins/authorize'

import { usersRateLimits } from '@/modules/users/users.config'
import {
  list,
  getOne,
  getOneForEdit,
  create,
  update,
  remove,
  assignRoles,
  revokeRoles,
} from '@/modules/users/users.handlers'
import {
  createUserSchema,
  updateUserSchema,
  userIdParamsSchema,
  userResponseSchema,
  assignUserRolesSchema,
  revokeUserRolesSchema,
} from '@/modules/users/users.schemas'

export async function usersRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/users',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_LIST])],
      config: { rateLimit: usersRateLimits.list },
      schema: {
        tags: ['Users'],
        summary: 'List all users',
        security: [{ bearerAuth: [] }],
        response: {
          200: apiResponse(z.array(userResponseSchema)),
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    list,
  )

  fastify.get(
    '/users/:userId',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_DETAIL])],
      config: { rateLimit: usersRateLimits.getOne },
      schema: {
        tags: ['Users'],
        summary: 'Get a user by ID',
        security: [{ bearerAuth: [] }],
        params: userIdParamsSchema,
        response: {
          200: apiResponse(userResponseSchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getOne,
  )

  fastify.get(
    '/users/:userId/edit',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_EDIT])],
      config: { rateLimit: usersRateLimits.getOne },
      schema: {
        tags: ['Users'],
        summary: 'Get user data for editing (includes roles)',
        security: [{ bearerAuth: [] }],
        params: userIdParamsSchema,
        response: {
          200: apiResponse(userResponseSchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getOneForEdit,
  )

  fastify.post(
    '/users',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_CREATE])],
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
          403: errorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    create,
  )

  fastify.put(
    '/users/:userId',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_EDIT])],
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
          403: errorResponseSchema,
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
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_DELETE])],
      config: { rateLimit: usersRateLimits.remove },
      schema: {
        tags: ['Users'],
        summary: 'Delete a user',
        security: [{ bearerAuth: [] }],
        params: userIdParamsSchema,
        response: {
          200: apiResponse(z.null()),
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    remove,
  )

  fastify.post(
    '/users/:userId/roles',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_ASSIGN_ROLES])],
      config: { rateLimit: usersRateLimits.update },
      schema: {
        tags: ['Users'],
        summary: 'Assign roles to a user',
        security: [{ bearerAuth: [] }],
        params: userIdParamsSchema,
        body: assignUserRolesSchema,
        response: {
          200: apiResponse(z.null()),
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    assignRoles,
  )

  fastify.delete(
    '/users/:userId/roles',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.USERS_ASSIGN_ROLES])],
      config: { rateLimit: usersRateLimits.remove },
      schema: {
        tags: ['Users'],
        summary: 'Revoke roles from a user',
        security: [{ bearerAuth: [] }],
        params: userIdParamsSchema,
        body: revokeUserRolesSchema,
        response: {
          200: apiResponse(z.null()),
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    revokeRoles,
  )
}
