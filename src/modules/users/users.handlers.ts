import { Prisma } from '@prisma/client'
import { FastifyReply } from 'fastify'

import { errorCodes } from '@/core/lib/errors'
import { ok, fail } from '@/core/lib/response'

import { responseMessages } from '@/modules/users/users.constants'
import {
  findAll,
  findById,
  findByIdForEdit,
  create as createUserRecord,
  update as updateUserRecord,
  remove as removeUserRecord,
  assignRoles as assignUserRoles,
  revokeRoles as revokeUserRoles,
} from '@/modules/users/users.service'
import type {
  TListUsersRequest,
  TGetUserRequest,
  TCreateUserRequest,
  TUpdateUserRequest,
  TDeleteUserRequest,
  TAssignUserRolesRequest,
  TRevokeUserRolesRequest,
} from '@/modules/users/users.types'

export const list = async (_request: TListUsersRequest, reply: FastifyReply) => {
  const users = await findAll()
  return reply.send(ok(users, responseMessages.USERS_RETRIEVED))
}

export const getOne = async (request: TGetUserRequest, reply: FastifyReply) => {
  const user = await findById(request.params.userId)
  if (!user) {
    return reply.status(404).send(fail(errorCodes.NOT_FOUND, responseMessages.USER_NOT_FOUND))
  }
  return reply.send(ok(user, responseMessages.USER_RETRIEVED))
}

export const getOneForEdit = async (request: TGetUserRequest, reply: FastifyReply) => {
  const user = await findByIdForEdit(request.params.userId)
  if (!user) {
    return reply.status(404).send(fail(errorCodes.NOT_FOUND, responseMessages.USER_NOT_FOUND))
  }
  return reply.send(ok(user, responseMessages.USER_RETRIEVED))
}

export const create = async (request: TCreateUserRequest, reply: FastifyReply) => {
  try {
    const user = await createUserRecord(request.body, request.currentUser?.id)
    return reply.status(201).send(ok(user, responseMessages.USER_CREATED))
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return reply
          .status(409)
          .send(fail(errorCodes.CONFLICT, responseMessages.EMAIL_ALREADY_IN_USE))
      }
    }
    throw err
  }
}

export const update = async (request: TUpdateUserRequest, reply: FastifyReply) => {
  try {
    const updatedUser = await updateUserRecord(
      request.params.userId,
      request.body,
      request.currentUser?.id,
    )
    return reply.send(ok(updatedUser, responseMessages.USER_UPDATED))
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return reply.status(404).send(fail(errorCodes.NOT_FOUND, responseMessages.USER_NOT_FOUND))
      }
      if (err.code === 'P2002') {
        return reply
          .status(409)
          .send(fail(errorCodes.CONFLICT, responseMessages.EMAIL_ALREADY_IN_USE))
      }
    }
    throw err
  }
}

export const remove = async (request: TDeleteUserRequest, reply: FastifyReply) => {
  if (request.params.userId === request.currentUser.id) {
    return reply.status(403).send(fail(errorCodes.FORBIDDEN, responseMessages.CANNOT_DELETE_SELF))
  }

  try {
    await removeUserRecord(request.params.userId)
    return reply.send(ok(null, responseMessages.USER_DELETED))
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        return reply.status(404).send(fail(errorCodes.NOT_FOUND, responseMessages.USER_NOT_FOUND))
      }
    }
    throw err
  }
}

export const assignRoles = async (request: TAssignUserRolesRequest, reply: FastifyReply) => {
  try {
    await assignUserRoles(request.params.userId, request.body)
    return reply.send(ok(null, responseMessages.ROLES_ASSIGNED))
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2003' || err.code === 'P2025') {
        return reply.status(404).send(fail(errorCodes.NOT_FOUND, responseMessages.ROLE_NOT_FOUND))
      }
    }
    throw err
  }
}

export const revokeRoles = async (request: TRevokeUserRolesRequest, reply: FastifyReply) => {
  await revokeUserRoles(request.params.userId, request.body)
  return reply.send(ok(null, responseMessages.ROLES_REVOKED))
}
