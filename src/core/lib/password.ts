import bcrypt from 'bcryptjs'

/**
 * Hashes a plain-text password using bcrypt with a cost factor of 10.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Compares a plain-text password against a stored bcrypt hash.
 * Returns `true` if they match, `false` otherwise.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
