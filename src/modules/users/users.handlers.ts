import { FastifyReply } from 'fastify'
import { Prisma } from '@prisma/client'
import { ok, fail } from '@/core/lib/response'
import { errorCodes } from '@/core/lib/errors'
import * as usersService from '@/modules/users/users.service'
import { responseMessages } from '@/modules/users/users.constants'
import type {
  TListUsersRequest,
  TGetUserRequest,
  TCreateUserRequest,
  TUpdateUserRequest,
  TDeleteUserRequest,
} from '@/modules/users/users.types'

export const list = async (_request: TListUsersRequest, reply: FastifyReply) => {
  const users = await usersService.findAll()
  return reply.send(ok(users, responseMessages.USERS_RETRIEVED))
}

export const getOne = async (request: TGetUserRequest, reply: FastifyReply) => {
  const user = await usersService.findById(request.params.userId)
  if (!user) {
    return reply.status(404).send(fail(errorCodes.NOT_FOUND, responseMessages.USER_NOT_FOUND))
  }
  return reply.send(ok(user, responseMessages.USER_RETRIEVED))
}

export const create = async (request: TCreateUserRequest, reply: FastifyReply) => {
  try {
    const user = await usersService.create(request.body, request.currentUser?.id)
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
    const updatedUser = await usersService.update(
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
  try {
    await usersService.remove(request.params.userId)
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
