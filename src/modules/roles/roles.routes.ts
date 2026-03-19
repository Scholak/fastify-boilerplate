import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { PERMISSIONS } from '@/core/lib/permissions'
import { errorResponseSchema, apiResponse } from '@/core/lib/schemas'
import { authenticate } from '@/core/plugins/authenticate'
import { authorize } from '@/core/plugins/authorize'

import { rolesRateLimits } from '@/modules/roles/roles.config'
import { list, getOne, getOneForEdit, create, update, remove } from '@/modules/roles/roles.handlers'
import {
  createRoleSchema,
  updateRoleSchema,
  roleIdParamsSchema,
  roleListResponseSchema,
  roleResponseSchema,
} from '@/modules/roles/roles.schemas'

export async function rolesRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/roles',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.ROLES_LIST])],
      config: { rateLimit: rolesRateLimits.list },
      schema: {
        tags: ['Roles'],
        summary: 'List all roles',
        security: [{ bearerAuth: [] }],
        response: {
          200: apiResponse(z.array(roleListResponseSchema)),
          401: errorResponseSchema,
          403: errorResponseSchema,
        },
      },
    },
    list,
  )

  fastify.get(
    '/roles/:roleId',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.ROLES_DETAIL])],
      config: { rateLimit: rolesRateLimits.getOne },
      schema: {
        tags: ['Roles'],
        summary: 'Get a role by ID',
        security: [{ bearerAuth: [] }],
        params: roleIdParamsSchema,
        response: {
          200: apiResponse(roleResponseSchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getOne,
  )

  fastify.get(
    '/roles/:roleId/edit',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.ROLES_EDIT])],
      config: { rateLimit: rolesRateLimits.getOne },
      schema: {
        tags: ['Roles'],
        summary: 'Get role data for editing',
        security: [{ bearerAuth: [] }],
        params: roleIdParamsSchema,
        response: {
          200: apiResponse(roleResponseSchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getOneForEdit,
  )

  fastify.post(
    '/roles',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.ROLES_CREATE])],
      config: { rateLimit: rolesRateLimits.create },
      schema: {
        tags: ['Roles'],
        summary: 'Create a new role',
        security: [{ bearerAuth: [] }],
        body: createRoleSchema,
        response: {
          201: apiResponse(roleResponseSchema),
          401: errorResponseSchema,
          403: errorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    create,
  )

  fastify.put(
    '/roles/:roleId',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.ROLES_EDIT])],
      config: { rateLimit: rolesRateLimits.update },
      schema: {
        tags: ['Roles'],
        summary: 'Update a role',
        security: [{ bearerAuth: [] }],
        params: roleIdParamsSchema,
        body: updateRoleSchema,
        response: {
          200: apiResponse(roleResponseSchema),
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
    '/roles/:roleId',
    {
      preHandler: [authenticate, authorize([PERMISSIONS.ROLES_DELETE])],
      config: { rateLimit: rolesRateLimits.remove },
      schema: {
        tags: ['Roles'],
        summary: 'Delete a role',
        security: [{ bearerAuth: [] }],
        params: roleIdParamsSchema,
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
}
