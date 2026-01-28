/**
 * Rate Limiting Middleware
 * Prevents spam and DoS attacks
 */

import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting (for production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Get client identifier (IP address)
 */
function getClientId(request: NextRequest): string {
  // Try to get IP from headers (for production with proxy)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}

/**
 * Rate limit configuration
 */
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
  message?: string;
}

const defaultConfig: RateLimitConfig = {
  maxRequests: 5, // 5 requests
  windowMs: 60 * 1000, // per minute
  message: 'Too many requests. Please try again later.',
};

/**
 * Rate limiting middleware
 */
export function rateLimit(
  request: NextRequest,
  config: Partial<RateLimitConfig> = {}
): NextResponse | null {
  const finalConfig = { ...defaultConfig, ...config };
  const clientId = getClientId(request);
  const now = Date.now();
  const key = `${clientId}:${request.nextUrl.pathname}`;

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    entry = {
      count: 1,
      resetTime: now + finalConfig.windowMs,
    };
    rateLimitStore.set(key, entry);
    return null; // Allow request
  }

  // Increment count
  entry.count++;

  if (entry.count > finalConfig.maxRequests) {
    // Rate limit exceeded
    return NextResponse.json(
      {
        success: false,
        message: finalConfig.message || 'Too many requests. Please try again later.',
        error: 'Rate limit exceeded',
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
          'X-RateLimit-Limit': finalConfig.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
        },
      }
    );
  }

  // Update store
  rateLimitStore.set(key, entry);

  // Allow request
  return null;
}

/**
 * Rate limit by email (for enquiry/contact forms)
 */
const emailRateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimitByEmail(
  email: string,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; resetTime?: number } {
  const finalConfig = { ...defaultConfig, ...config };
  const now = Date.now();
  const key = `email:${email.toLowerCase()}`;

  let entry = emailRateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + finalConfig.windowMs,
    };
    emailRateLimitStore.set(key, entry);
    return { allowed: true };
  }

  entry.count++;

  if (entry.count > finalConfig.maxRequests) {
    return {
      allowed: false,
      resetTime: entry.resetTime,
    };
  }

  emailRateLimitStore.set(key, entry);
  return { allowed: true };
}

// Clean up email rate limit store
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of emailRateLimitStore.entries()) {
    if (value.resetTime < now) {
      emailRateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

