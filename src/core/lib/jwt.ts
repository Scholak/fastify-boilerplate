import { SignJWT, jwtVerify } from 'jose'
import { config } from '@/core/config'

/** HS256 secret for short-lived access tokens (15 minutes). */
const accessSecret = new TextEncoder().encode(config.jwtSecret)

/** HS256 secret for long-lived refresh tokens (7 days). */
const refreshSecret = new TextEncoder().encode(config.jwtRefreshSecret)

/**
 * Signs a short-lived access token (15 minutes).
 * @param payload - User identity claims embedded in the token.
 */
export async function signAccessToken(payload: { userId: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(accessSecret)
}

/**
 * Verifies an access token and returns its payload.
 * Throws if the token is invalid or expired.
 */
export async function verifyAccessToken(token: string): Promise<{ userId: string; email: string }> {
  const { payload } = await jwtVerify(token, accessSecret)
  return payload as { userId: string; email: string }
}

/**
 * Signs a long-lived refresh token (7 days).
 * @param payload - User identity claims embedded in the token.
 */
export async function signRefreshToken(payload: {
  userId: string
  email: string
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(refreshSecret)
}

/**
 * Verifies a refresh token and returns its payload.
 * Throws if the token is invalid or expired.
 */
export async function verifyRefreshToken(
  token: string,
): Promise<{ userId: string; email: string }> {
  const { payload } = await jwtVerify(token, refreshSecret)
  return payload as { userId: string; email: string }
}
