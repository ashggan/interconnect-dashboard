import NextAuth from 'next-auth';
import authConfig from './auth.config';
import crypto from 'crypto';
import { promisify } from 'util';

// Convert callback-based functions to Promise-based
const scryptAsync = promisify(crypto.scrypt);
const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * Hashes a password using Node's crypto scrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = (await randomBytesAsync(16)).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifies a password against its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const [salt, key] = hash.split(':');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
}

export const { auth, handlers, signOut, signIn } = NextAuth(authConfig);
