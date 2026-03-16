# Fastify Boilerplate

A production-ready REST API boilerplate built with Fastify, TypeScript, Prisma, and Redis.

## Tech Stack

- **[Fastify 5](https://fastify.dev/)** — Fast and low overhead web framework
- **[TypeScript](https://www.typescriptlang.org/)** — Static typing
- **[Prisma 6](https://www.prisma.io/)** — ORM with PostgreSQL
- **[jose](https://github.com/panva/jose)** — JWT access & refresh tokens (HS256)
- **[ioredis](https://github.com/redis/ioredis)** — Redis caching
- **[Zod](https://zod.dev/)** — Request validation
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** — Password hashing
- **[pino](https://getpino.io/)** — Structured logging with pino-pretty in development
- **[@fastify/swagger](https://github.com/fastify/fastify-swagger)** — OpenAPI docs at `/docs`
- **[@fastify/rate-limit](https://github.com/fastify/fastify-rate-limit)** — Global and per-route rate limiting
- **[@fastify/helmet](https://github.com/fastify/fastify-helmet)** — Security headers
- **[@fastify/cors](https://github.com/fastify/fastify-cors)** — CORS support
- **[@fastify/cookie](https://github.com/fastify/fastify-cookie)** — Cookie parsing and serialization
- **[AWS SES](https://aws.amazon.com/ses/)** — Transactional email (password reset)

## Project Structure

```
fastify-boilerplate/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script (admin user)
├── src/
│   ├── index.ts               # Entry point
│   ├── app.ts                 # Singleton Fastify instance
│   ├── core/
│   │   ├── config.ts          # Environment configuration
│   │   ├── bootstrap.ts       # App factory & plugin registration
│   │   ├── lib/
│   │   │   ├── errors.ts      # Error codes
│   │   │   ├── response.ts    # Standardized response helpers
│   │   │   ├── jwt.ts         # JWT sign/verify helpers
│   │   │   ├── password.ts    # bcrypt helpers
│   │   │   └── email.ts       # SES email sender
│   │   └── plugins/
│   │       ├── authenticate.ts  # JWT auth preHandler hook
│   │       ├── error-handler.ts # Global error handler
│   │       ├── prisma.ts        # Prisma plugin
│   │       └── redis.ts         # ioredis plugin
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.config.ts     # Rate limit config
│   │   │   ├── auth.constants.ts  # Response messages
│   │   │   ├── auth.types.ts      # TypeScript types
│   │   │   ├── auth.schemas.ts    # Zod schemas
│   │   │   ├── auth.service.ts    # Business logic
│   │   │   ├── auth.handlers.ts   # Route handlers
│   │   │   ├── auth.routes.ts     # Route definitions
│   │   │   └── templates/
│   │   │       └── reset-password.template.ts
│   │   └── users/
│   │       ├── users.config.ts    # Rate limit config
│   │       ├── users.constants.ts # Response messages
│   │       ├── users.types.ts     # TypeScript types
│   │       ├── users.schemas.ts   # Zod schemas
│   │       ├── users.service.ts   # Business logic + Redis cache
│   │       ├── users.handlers.ts  # Route handlers
│   │       └── users.routes.ts    # Route definitions
│   └── types/
│       └── fastify.d.ts       # Fastify type augmentations
├── .env.example
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis

### Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

3. Push the database schema and generate the Prisma client:

```bash
npm run db:push
```

4. Seed the database with an admin user:

```bash
npm run db:seed
```

Default admin credentials: `admin@example.com` / `Admin123!`

5. Start the development server:

```bash
npm run dev
```

The server starts on `http://localhost:8080`. API docs are available at `http://localhost:8080/docs`.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Create and run a migration |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed the database |
| `npm run format` | Format source files with Prettier |
| `npm run check-format` | Check formatting without writing |
| `npm run lint` | Lint source files with ESLint |
| `npm run lint:fix` | Lint and auto-fix issues |

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment (`development`/`production`) | `development` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Access token signing secret | — |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | — |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `REDIS_USERNAME` | Redis username (optional) | — |
| `REDIS_PASSWORD` | Redis password (optional) | — |
| `REDIS_TTL` | Cache TTL in seconds | `300` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS access key | — |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | — |
| `SES_FROM_EMAIL` | Sender email address (SES verified) | — |
| `SES_FROM_NAME` | Sender display name | — |
| `APP_URL` | App base URL (used in email links) | `http://localhost:3000` |

## API Endpoints

### Health

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |

### Auth

| Method | Path | Auth | Rate Limit | Description |
|---|---|---|---|---|
| POST | `/auth/sign-in` | — | 5 / 15 min | Sign in with email & password |
| POST | `/auth/forgot-password` | — | 3 / 1 hr | Request password reset email |
| POST | `/auth/reset-password` | — | 10 / 1 hr | Reset password with token |
| GET | `/auth/get-token` | Refresh token | 30 / 15 min | Get new access token |
| GET | `/auth/me` | Bearer | — | Get current user |
| PUT | `/auth/profile` | Bearer | 20 / min | Update current user profile |
| PUT | `/auth/profile/password` | Bearer | 5 / 15 min | Change current user password |

### Users

All user endpoints require `Authorization: Bearer <accessToken>`.

| Method | Path | Rate Limit | Description |
|---|---|---|---|
| GET | `/users` | 60 / min | List all users |
| POST | `/users` | 20 / min | Create user |
| GET | `/users/:userId` | 60 / min | Get user by ID |
| PUT | `/users/:userId` | 30 / min | Update user |
| DELETE | `/users/:userId` | 20 / min | Delete user |

### Response Format

All endpoints return a consistent JSON envelope:

**Success:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "...",
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "..."
}
```

**Paginated:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "...",
  "data": [],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

## Authentication Flow

1. **Sign in** — `POST /auth/sign-in` returns `accessToken` (15 min) and `refreshToken` (7 days)
2. **Authenticated requests** — Include `Authorization: Bearer <accessToken>` header
3. **Refresh** — `GET /auth/get-token` with `Authorization: Bearer <refreshToken>` returns a new `accessToken`

## Adding a New Module

Each module follows this file structure:

```
src/modules/<name>/
├── <name>.config.ts      # Rate limit config
├── <name>.constants.ts   # Response messages
├── <name>.types.ts       # TypeScript types (T-prefixed)
├── <name>.schemas.ts     # Zod validation schemas
├── <name>.service.ts     # Business logic
├── <name>.handlers.ts    # Route handlers (separate exported functions)
└── <name>.routes.ts      # Fastify route registration (includes inline schema/docs)
```

Register the module in `src/index.ts`:

```typescript
await fastify.register(myModuleRoutes, { prefix: '/api' });
```

## Database

The schema uses PostgreSQL with Prisma. The `User` model includes:

- CUID primary keys
- Self-referential `createdBy`/`updatedBy` relations for audit trails
- Password reset token with expiry
- Optional S3-hosted profile image URL

Run `npm run db:migrate` to create a named migration for schema changes in production.

## Caching

Redis is used for caching user queries in the users service. Cached data expires after `REDIS_TTL` seconds (default 300). The cache is invalidated on create, update, and delete operations.
