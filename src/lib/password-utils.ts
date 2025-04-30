import bcryptjs from 'bcryptjs';

/**
 * Hashes a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Standard recommendation for bcrypt
  return bcryptjs.hash(password, saltRounds);
}

/**
 * Verifies a password against its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}
