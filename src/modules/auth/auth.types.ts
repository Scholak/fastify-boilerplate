import { FastifyRequest, RouteGenericInterface } from 'fastify'
import {
  TChangePasswordSchema,
  TForgotPasswordSchema,
  TResetPasswordSchema,
  TSignInSchema,
  TUpdateProfileSchema,
} from './auth.schemas'

// --- Model types ---

export type TSignInRequest = FastifyRequest<{ Body: TSignInSchema } & RouteGenericInterface>
export type TForgotPasswordRequest = FastifyRequest<
  { Body: TForgotPasswordSchema } & RouteGenericInterface
>
export type TResetPasswordRequest = FastifyRequest<
  { Body: TResetPasswordSchema } & RouteGenericInterface
>
export type TUpdateProfileRequest = FastifyRequest<
  { Body: TUpdateProfileSchema } & RouteGenericInterface
>
export type TChangePasswordRequest = FastifyRequest<
  { Body: TChangePasswordSchema } & RouteGenericInterface
>
