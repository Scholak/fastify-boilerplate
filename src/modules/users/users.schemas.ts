import { z } from 'zod'
import { validationMessages as vm } from '@/modules/users/users.constants'

export const createUserSchema = z
  .object({
    firstName: z.string().min(1, vm.firstName.required),
    lastName: z.string().min(1, vm.lastName.required),
    email: z.email({ error: vm.email.invalid }),
    password: z
      .string()
      .min(8, vm.password.min)
      .regex(/[A-Z]/, vm.password.uppercase)
      .regex(/[0-9]/, vm.password.number),
    confirmPassword: z.string().min(1, vm.confirmPassword.required),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: vm.confirmPassword.match,
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

export const userResponseSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  photo: z.string().nullable(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  createdById: z.string().nullable(),
  updatedById: z.string().nullable(),
})

export type TCreateUserSchema = z.infer<typeof createUserSchema>
export type TUpdateUserSchema = z.infer<typeof updateUserSchema>
