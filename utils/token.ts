/**
 * Token Utility Functions
 * Helper functions for token management and validation
 */

import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
}

/**
 * Decode JWT token without verification
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  // Check if token expires in less than 5 minutes (refresh before expiry)
  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const fiveMinutesInMs = 5 * 60 * 1000;

  return expirationTime - currentTime < fiveMinutesInMs;
}

/**
 * Check if token is completely expired
 */
export function isTokenFullyExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  return currentTime >= expirationTime;
}

/**
 * Get token expiration time
 */
export function getTokenExpirationTime(token: string): number | null {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  return decoded.exp * 1000; // Return in milliseconds
}

/**
 * Get time until token expires (in milliseconds)
 */
export function getTimeUntilExpiry(token: string): number | null {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) {
    return null;
  }

  const currentTime = Date.now();
  return expirationTime - currentTime;
}

