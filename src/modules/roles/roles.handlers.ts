import { Prisma } from '@prisma/client'
import { FastifyReply } from 'fastify'

import { errorCodes } from '@/core/lib/errors'
import { ok, fail } from '@/core/lib/response'

import { responseMessages } from '@/modules/roles/roles.constants'
import {
  findAll,
  findById,
  create as createRoleRecord,
  update as updateRoleRecord,
  remove as removeRoleRecord,
} from '@/modules/roles/roles.service'
import type {
  TListRolesRequest,
  TGetRoleRequest,
  TCreateRoleRequest,
  TUpdateRoleRequest,
  TDeleteRoleRequest,
} from '@/modules/roles/roles.types'

export const list = async (_request: TListRolesRequest, reply: FastifyReply) => {
  const roles = await findAll()
  return reply.send(ok(roles, responseMessages.ROLES_RETRIEVED))
}

export const getOne = async (request: TGetRoleRequest, reply: FastifyReply) => {
  const role = await findById(request.params.roleId)
  if (!role) {
    return reply.status(404).send(fail(errorCodes.NOT_FOUND, responseMessages.ROLE_NOT_FOUND))
  }
  return reply.send(ok(role, responseMessages.ROLE_RETRIEVED))
}

export const getOneForEdit = async (request: TGetRoleRequest, reply: FastifyReply) => {
  const role = await findById(request.params.roleId)
  if (!role) {
    return reply.status(404).send(fail(errorCodes.NOT_FOUND, responseMessages.ROLE_NOT_FOUND))
  }
  return reply.send(ok(role, responseMessages.ROLE_RETRIEVED))
}

export const create = async (request: TCreateRoleRequest, reply: FastifyReply) => {
  try {
    const role = await createRoleRecord(request.body)
    return reply.status(201).send(ok(role, responseMessages.ROLE_CREATED))
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return reply.status(409).send(fail(errorCodes.CONFLICT, responseMessages.ROLE_NAME_TAKEN))
    }
    throw err
  }
}

export const update = async (request: TUpdateRoleRequest, reply: FastifyReply) => {
  const existing = await findById(request.params.roleId)
  if (!existing) {
    return reply.status(404).send(fail(errorCodes.NOT_FOUND, responseMessages.ROLE_NOT_FOUND))
  }
  if (existing.name === 'Admin') {
    return reply.status(403).send(fail(errorCodes.FORBIDDEN, responseMessages.ADMIN_ROLE_READONLY))
  }

  try {
    const role = await updateRoleRecord(request.params.roleId, request.body)
    return reply.send(ok(role, responseMessages.ROLE_UPDATED))
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return reply.status(404).send(fail(errorCodes.NOT_FOUND, responseMessages.ROLE_NOT_FOUND))
      }
      if (err.code === 'P2002') {
        return reply.status(409).send(fail(errorCodes.CONFLICT, responseMessages.ROLE_NAME_TAKEN))
      }
    }
    throw err
  }
}

export const remove = async (request: TDeleteRoleRequest, reply: FastifyReply) => {
  const existing = await findById(request.params.roleId)
  if (!existing) {
    return reply.status(404).send(fail(errorCodes.NOT_FOUND, responseMessages.ROLE_NOT_FOUND))
  }
  if (existing.name === 'Admin') {
    return reply.status(403).send(fail(errorCodes.FORBIDDEN, responseMessages.ADMIN_ROLE_READONLY))
  }

  try {
    await removeRoleRecord(request.params.roleId)
    return reply.send(ok(null, responseMessages.ROLE_DELETED))
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return reply.status(404).send(fail(errorCodes.NOT_FOUND, responseMessages.ROLE_NOT_FOUND))
    }
    throw err
  }
}
