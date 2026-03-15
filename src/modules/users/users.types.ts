import { FastifyRequest, RouteGenericInterface } from 'fastify'
import { TCreateUserSchema, TUpdateUserSchema } from './users.schemas'

// --- Model types ---

export interface TUserModel {
  id: string
  firstName: string
  lastName: string
  email: string
  profile: string | null
  createdAt: Date
  updatedAt: Date
  createdById: string | null
  updatedById: string | null
}

// --- Param / body types ---

export interface TGetUserParams {
  userId: string
}

export interface TCreateUserBody {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface TUpdateUserBody {
  firstName?: string
  lastName?: string
  email?: string
}

// --- Request types (used as handler parameter types) ---

export type TListUsersRequest = FastifyRequest
export type TGetUserRequest = FastifyRequest<{ Params: TGetUserParams } & RouteGenericInterface>
export type TCreateUserRequest = FastifyRequest<{ Body: TCreateUserSchema } & RouteGenericInterface>
export type TUpdateUserRequest = FastifyRequest<
  { Params: TGetUserParams; Body: TUpdateUserSchema } & RouteGenericInterface
>
export type TDeleteUserRequest = FastifyRequest<{ Params: TGetUserParams } & RouteGenericInterface>
