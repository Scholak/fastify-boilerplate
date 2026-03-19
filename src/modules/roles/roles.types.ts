import { FastifyRequest, RouteGenericInterface } from 'fastify'

import { TCreateRoleSchema, TUpdateRoleSchema } from '@/modules/roles/roles.schemas'

export interface TRoleIdParams {
  roleId: string
}

export type TListRolesRequest = FastifyRequest
export type TGetRoleRequest = FastifyRequest<{ Params: TRoleIdParams } & RouteGenericInterface>
export type TCreateRoleRequest = FastifyRequest<
  { Body: TCreateRoleSchema } & RouteGenericInterface
>
export type TUpdateRoleRequest = FastifyRequest<
  { Params: TRoleIdParams; Body: TUpdateRoleSchema } & RouteGenericInterface
>
export type TDeleteRoleRequest = FastifyRequest<{ Params: TRoleIdParams } & RouteGenericInterface>
