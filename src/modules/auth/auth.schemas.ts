import { z } from 'zod'

import { validationMessages } from '@/modules/auth/auth.constants'

const {
  email,
  password,
  firstName,
  lastName,
  token,
  newPassword,
  confirmPassword,
  currentPassword,
} = validationMessages

export const signInSchema = z.object({
  email: z.email({ error: email.invalid }),
  password: z.string().min(1, password.required),
})

export const forgotPasswordSchema = z.object({
  email: z.email({ error: email.invalid }),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, token.required),
    newPassword: z
      .string()
      .min(8, newPassword.min)
      .regex(/[A-Z]/, newPassword.uppercase)
      .regex(/[0-9]/, newPassword.number),
    confirmPassword: z.string().min(1, confirmPassword.required),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: confirmPassword.match,
    path: ['confirmPassword'],
  })

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, firstName.required),
  lastName: z.string().min(1, lastName.required),
  email: z.email({ error: email.invalid }),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, currentPassword.required),
    newPassword: z
      .string()
      .min(1, newPassword.required)
      .min(8, newPassword.min)
      .regex(/[A-Z]/, newPassword.uppercase)
      .regex(/[0-9]/, newPassword.number),
    confirmPassword: z.string().min(1, confirmPassword.required),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: confirmPassword.match,
  })

export const authRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.array(z.string()),
})

export const authUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  roles: z.array(authRoleSchema),
  permissions: z.array(z.string()),
})

export const currentUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  roles: z.array(authRoleSchema),
  permissions: z.array(z.string()),
})

export type TSignInSchema = z.infer<typeof signInSchema>
export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type TUpdateProfileSchema = z.infer<typeof updateProfileSchema>
export type TChangePasswordSchema = z.infer<typeof changePasswordSchema>
