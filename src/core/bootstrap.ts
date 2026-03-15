import Fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import fastifyCookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { config } from '@/core/config'
import prismaPlugin from '@/core/plugins/prisma'
import redisPlugin from '@/core/plugins/redis'
import errorHandlerPlugin from '@/core/plugins/error-handler'
import multipartFieldsPlugin from '@/core/plugins/multipart-fields'
import { fail } from '@/core/lib/response'
import { errorCodes } from '@/core/lib/errors'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export function createApp() {
  const fastify = Fastify({
    logger: {
      level: config.nodeEnv === 'production' ? 'warn' : 'info',
      ...(config.nodeEnv !== 'production' && {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
        },
      }),
    },
    ajv: {
      customOptions: {
        allErrors: true,
        strict: false,
      },
      onCreate: (ajv) => {
        ajv.addKeyword({ keyword: 'example' })
      },
    },
  })
  return fastify
}

export async function registerPlugins(fastify: ReturnType<typeof createApp>) {
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)
  fastify.withTypeProvider<ZodTypeProvider>()

  await fastify.register(helmet, {
    contentSecurityPolicy: config.nodeEnv === 'production',
  })

  await fastify.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  await fastify.register(fastifyCookie)

  await fastify.register(rateLimit, {
    global: true,
    max: 200,
    timeWindow: '1 minute',
    errorResponseBuilder: (_req, context) =>
      fail(errorCodes.RATE_LIMIT_EXCEEDED, `Too many requests. Try again in ${context.after}.`),
  })

  await fastify.register(swagger, {
    transform: jsonSchemaTransform,
    openapi: {
      info: {
        title: 'Fastify Boilerplate API',
        version: '1.0.0',
        description: 'API documentation',
      },
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  })
  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list', deepLinking: true },
  })

  await fastify.register(prismaPlugin)
  await fastify.register(redisPlugin)
  await fastify.register(multipart, {
    attachFieldsToBody: true,
    limits: { fileSize: 5 * 1024 * 1024 },
  })
  await fastify.register(errorHandlerPlugin)
  await fastify.register(multipartFieldsPlugin)
}
