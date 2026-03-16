import { z } from 'zod'
import { validationMessages as vm } from '@/modules/auth/auth.constants'

export const signInSchema = z.object({
  email: z.email({ error: vm.email.invalid }),
  password: z.string().min(1, vm.password.required),
})

export const forgotPasswordSchema = z.object({
  email: z.email({ error: vm.email.invalid }),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, vm.token.required),
    newPassword: z
      .string()
      .min(8, vm.newPassword.min)
      .regex(/[A-Z]/, vm.newPassword.uppercase)
      .regex(/[0-9]/, vm.newPassword.number),
    confirmPassword: z.string().min(1, vm.confirmPassword.required),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: vm.confirmPassword.match,
    path: ['confirmPassword'],
  })

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, vm.firstName.required),
  lastName: z.string().min(1, vm.lastName.required),
  email: z.email({ error: vm.email.invalid }),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, vm.currentPassword.required),
    newPassword: z
      .string()
      .min(1, vm.newPassword.required)
      .min(8, vm.newPassword.min)
      .regex(/[A-Z]/, vm.newPassword.uppercase)
      .regex(/[0-9]/, vm.newPassword.number),
    confirmPassword: z.string().min(1, vm.confirmPassword.required),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: vm.confirmPassword.match,
  })

export const authUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
})

export const currentUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
})

export type TSignInSchema = z.infer<typeof signInSchema>
export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type TUpdateProfileSchema = z.infer<typeof updateProfileSchema>
export type TChangePasswordSchema = z.infer<typeof changePasswordSchema>
