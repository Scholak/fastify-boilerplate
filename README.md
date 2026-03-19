# Fastify Boilerplate

A production-ready REST API template built with Fastify, TypeScript, Prisma, and Redis. Includes user and role management, JWT-based authentication, role-based access control (RBAC), Redis caching, and email delivery via AWS SES.

## Tech Stack

- **[Fastify 5](https://fastify.dev/)** — High-performance web framework
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe development
- **[Prisma 6](https://www.prisma.io/)** — PostgreSQL ORM
- **[Zod 4](https://zod.dev/)** — Schema validation
- **[jose](https://github.com/panva/jose)** — JWT access and refresh tokens (HS256)
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** — Password hashing
- **[ioredis](https://github.com/redis/ioredis)** — Redis caching
- **[AWS SES](https://aws.amazon.com/ses/)** — Transactional email (password reset)
- **[pino](https://getpino.io/)** — Structured logging
- **[@fastify/swagger](https://github.com/fastify/fastify-swagger)** — OpenAPI documentation at `/docs`
- **[@fastify/rate-limit](https://github.com/fastify/fastify-rate-limit)** — Global and per-route rate limiting
- **[@fastify/helmet](https://github.com/fastify/fastify-helmet)** — Security headers
- **[@fastify/cors](https://github.com/fastify/fastify-cors)** — CORS support
- **[@fastify/cookie](https://github.com/fastify/fastify-cookie)** — Cookie handling

## Features

- JWT-based authentication (access token 15 min, refresh token 7 days)
- Role-based access control (RBAC) — role and permission management
- Assigned roles and permissions returned in the sign-in response
- User CRUD (create, read, update, delete)
- Role assignment and removal
- Password reset via email link
- Redis caching for user and role data
- Admin role is read-only (cannot be edited or deleted)
- Users cannot delete their own account

## Project Structure

```
fastify-boilerplate/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script (Admin role + initial user)
├── src/
│   ├── index.ts               # Entry point
│   ├── app.ts                 # Fastify singleton instance
│   ├── core/
│   │   ├── config.ts          # Environment variables
│   │   ├── bootstrap.ts       # Application factory and plugin registration
│   │   ├── lib/
│   │   │   ├── errors.ts      # Error codes
│   │   │   ├── response.ts    # Standard response helpers (ok / fail)
│   │   │   ├── jwt.ts         # JWT signing/verification
│   │   │   ├── password.ts    # bcrypt helpers
│   │   │   ├── permissions.ts # Permission constants
│   │   │   └── email.ts       # SES email sender
│   │   └── plugins/
│   │       ├── authenticate.ts  # JWT verification preHandler hook
│   │       ├── error-handler.ts # Global error handler
│   │       ├── prisma.ts        # Prisma plugin
│   │       └── redis.ts         # ioredis plugin
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.constants.ts  # Validation and response messages
│   │   │   ├── auth.types.ts      # TypeScript types
│   │   │   ├── auth.schemas.ts    # Zod schemas
│   │   │   ├── auth.service.ts    # Business logic
│   │   │   ├── auth.handlers.ts   # Route handlers
│   │   │   ├── auth.routes.ts     # Route definitions
│   │   │   └── templates/
│   │   │       └── reset-password.template.ts
│   │   ├── users/
│   │   │   ├── users.constants.ts # Validation and response messages
│   │   │   ├── users.types.ts     # TypeScript types
│   │   │   ├── users.schemas.ts   # Zod schemas
│   │   │   ├── users.service.ts   # Business logic + Redis cache
│   │   │   ├── users.handlers.ts  # Route handlers
│   │   │   └── users.routes.ts    # Route definitions
│   │   └── roles/
│   │       ├── roles.constants.ts # Validation and response messages
│   │       ├── roles.types.ts     # TypeScript types
│   │       ├── roles.schemas.ts   # Zod schemas
│   │       ├── roles.service.ts   # Business logic
│   │       ├── roles.handlers.ts  # Route handlers
│   │       └── roles.routes.ts    # Route definitions
│   └── types/
│       └── fastify.d.ts       # Fastify type augmentations
├── .env.example
├── tsconfig.json
└── package.json
```

## Getting Started

### Requirements

- Node.js 20+
- PostgreSQL
- Redis

### Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and fill in the values:

```bash
cp .env.example .env
```

3. Apply the database schema:

```bash
npm run db:push
```

4. Seed the database (creates the Admin role and initial user):

```bash
npm run db:seed
```

Default admin credentials: `admin@example.com` / `Admin123!`

5. Start the development server:

```bash
npm run dev
```

The server starts at `http://localhost:8080`. Visit `http://localhost:8080/docs` for Swagger UI.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled production build |
| `npm run db:push` | Apply schema changes to the database |
| `npm run db:migrate` | Create and apply a migration |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed the database |
| `npm run format` | Format source files with Prettier |
| `npm run check-format` | Check formatting without modifying files |
| `npm run lint` | Lint source files with ESLint |
| `npm run lint:fix` | Auto-fix ESLint errors |

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment (`development`/`production`) | `development` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Access token signing key | — |
| `JWT_REFRESH_SECRET` | Refresh token signing key | — |
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
| `APP_URL` | Application base URL (used in email links) | `http://localhost:3000` |

## API Endpoints

### Health

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |

### Authentication

| Method | Path | Auth | Rate Limit | Description |
|---|---|---|---|---|
| POST | `/auth/sign-in` | — | 5 / 15 min | Sign in with email and password |
| POST | `/auth/sign-out` | Bearer | 10 / 1 min | Sign out and clear the refresh token cookie |
| POST | `/auth/forgot-password` | — | 3 / 1 hr | Send a password reset email |
| POST | `/auth/reset-password` | — | 10 / 1 hr | Reset password using a token |
| GET | `/auth/get-token` | Refresh token | 30 / 15 min | Get a new access token |
| GET | `/auth/me` | Bearer | — | Get current user (including roles and permissions) |
| PUT | `/auth/profile` | Bearer | 20 / min | Update profile information |
| PUT | `/auth/profile/password` | Bearer | 5 / 15 min | Change password |

### Users

All user endpoints require `Authorization: Bearer <accessToken>`.

| Method | Path | Rate Limit | Description |
|---|---|---|---|
| GET | `/users` | 60 / min | List users |
| POST | `/users` | 20 / min | Create a user |
| GET | `/users/:userId` | 60 / min | Get user detail |
| GET | `/users/:userId/edit` | 60 / min | Get user for editing |
| PUT | `/users/:userId` | 30 / min | Update a user |
| DELETE | `/users/:userId` | 20 / min | Delete a user (cannot delete own account) |
| POST | `/users/:userId/roles` | 30 / min | Assign roles to a user |
| DELETE | `/users/:userId/roles` | 30 / min | Remove roles from a user |

### Roles

All role endpoints require `Authorization: Bearer <accessToken>`.

| Method | Path | Description |
|---|---|---|
| GET | `/roles` | List roles |
| POST | `/roles` | Create a role |
| GET | `/roles/:roleId` | Get role detail |
| GET | `/roles/:roleId/edit` | Get role for editing |
| PUT | `/roles/:roleId` | Update a role (Admin role cannot be edited) |
| DELETE | `/roles/:roleId` | Delete a role (Admin role cannot be deleted) |

## Response Format

All endpoints return a consistent JSON envelope:

**Success:**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "...",
  "data": {}
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

## Authentication Flow

1. **Sign in** — `POST /auth/sign-in` → `accessToken` (15 min) + `refreshToken` cookie (7 days) + user info (including roles and permissions)
2. **Authenticated requests** — `Authorization: Bearer <accessToken>` header is attached
3. **Token refresh** — `GET /auth/get-token` uses the refresh token cookie to return a new `accessToken`
4. **Sign out** — `POST /auth/sign-out` clears the refresh token cookie server-side

## Database Schema

| Model | Description |
|---|---|
| `User` | User info, password hash, reset token, audit relations |
| `Role` | Role name (unique) |
| `RolePermission` | Role–permission mapping (composite primary key) |
| `UserRole` | User–role mapping (composite primary key, cascade delete) |

## Permissions

| Permission | Description |
|---|---|
| `users.list` | View the user list |
| `users.detail` | View user detail |
| `users.create` | Create a user |
| `users.edit` | Update a user |
| `users.delete` | Delete a user |
| `users.assign-roles` | Assign or remove roles for a user |
| `roles.list` | View the role list |
| `roles.detail` | View role detail |
| `roles.create` | Create a role |
| `roles.edit` | Update a role |
| `roles.delete` | Delete a role |

## Adding a New Module

Each module follows this file structure:

```
src/modules/<name>/
├── <name>.constants.ts   # Validation and response messages
├── <name>.types.ts       # TypeScript types (T- prefix)
├── <name>.schemas.ts     # Zod validation schemas
├── <name>.service.ts     # Business logic
├── <name>.handlers.ts    # Route handlers (individually exported functions)
└── <name>.routes.ts      # Fastify route registration
```

Register the new module in `src/index.ts`:

```typescript
await fastify.register(myModuleRoutes, { prefix: '/api' })
```

## Caching

Redis is used to cache user and role queries. Cached data expires after `REDIS_TTL` seconds (default 300). The relevant cache is invalidated on create, update, and delete operations.

## Related Projects

See [react-boilerplate](../react-boilerplate) for the React frontend that consumes this API. The React app:

- Uses `export default` for all React components
- Defines all components as arrow functions (`const X = () => {}`)
- Uses the `@/` absolute alias for all import paths
- Does not use `import { x as y }` shorthand aliases or `import * as x` wildcard imports
- Confirms user and role deletions with a Modal dialog
- Features an enhanced profile page (avatar, role badges, side-by-side form layout)
