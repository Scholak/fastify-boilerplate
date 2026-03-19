import { z } from 'zod'

import { PERMISSIONS } from '@/core/lib/permissions'

import { validationMessages } from '@/modules/roles/roles.constants'

const { name, permissions } = validationMessages

const validPermissionKeys = Object.values(PERMISSIONS) as [string, ...string[]]

export const createRoleSchema = z.object({
  name: z.string().min(1, name.required),
  permissions: z.array(z.enum(validPermissionKeys, { error: permissions.invalid })).default([]),
})

export const updateRoleSchema = z.object({
  name: z.string().min(1, name.required),
  permissions: z.array(z.enum(validPermissionKeys, { error: permissions.invalid })).default([]),
})

export const roleIdParamsSchema = z.object({
  roleId: z.string(),
})

export const roleListResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
})

export const roleResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.array(z.string()),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
})

export type TCreateRoleSchema = z.infer<typeof createRoleSchema>
export type TUpdateRoleSchema = z.infer<typeof updateRoleSchema>
