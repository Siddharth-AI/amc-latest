/**
 * JWT Token Management
 * Sign and verify JWT tokens for authentication
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';
const JWT_ACCESS_EXPIRY: string = process.env.JWT_ACCESS_EXPIRY || '1d'; // 1 day
const JWT_REFRESH_EXPIRY: string = process.env.JWT_REFRESH_EXPIRY || '7d'; // 7 days

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Sign access token
 */
export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload as object, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY,
  } as jwt.SignOptions);
}

/**
 * Sign refresh token
 */
export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload as object, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY,
  } as jwt.SignOptions);
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}

