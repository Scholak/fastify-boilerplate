import { z } from 'zod'

import { validationMessages } from '@/modules/users/users.constants'

const { firstName, lastName, email, password, confirmPassword } = validationMessages

export const createUserSchema = z
  .object({
    firstName: z.string().min(1, firstName.required),
    lastName: z.string().min(1, lastName.required),
    email: z.email({ error: email.invalid }),
    password: z
      .string()
      .min(8, password.min)
      .regex(/[A-Z]/, password.uppercase)
      .regex(/[0-9]/, password.number),
    confirmPassword: z.string().min(1, confirmPassword.required),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: confirmPassword.match,
    path: ['confirmPassword'],
  })

export const updateUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
})

export const userIdParamsSchema = z.object({
  userId: z.string(),
})

export const assignUserRolesSchema = z.object({
  roleIds: z.array(z.string()).min(1, 'At least one role ID is required'),
})

export const revokeUserRolesSchema = z.object({
  roleIds: z.array(z.string()).min(1, 'At least one role ID is required'),
})

export const updateUserRolesSchema = z.object({
  roleIds: z.array(z.string()),
})

export const userRolesResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    permissions: z.array(z.string()),
  }),
)

export const userResponseSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  createdById: z.string().nullable(),
  updatedById: z.string().nullable(),
  roles: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      permissions: z.array(z.string()),
    }),
  ),
})

export type TCreateUserSchema = z.infer<typeof createUserSchema>
export type TUpdateUserSchema = z.infer<typeof updateUserSchema>
export type TAssignUserRolesSchema = z.infer<typeof assignUserRolesSchema>
export type TRevokeUserRolesSchema = z.infer<typeof revokeUserRolesSchema>
export type TUpdateUserRolesSchema = z.infer<typeof updateUserRolesSchema>
