/**
 * Input Sanitization Utility
 * Removes HTML, scripts, and malicious content from user input
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize string input - removes all HTML/JS
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags and scripts
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content, remove tags
  });

  // Trim whitespace
  return sanitized.trim();
}

/**
 * Sanitize email - basic sanitization (email format is validated separately)
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  // Remove any HTML/JS
  const sanitized = sanitizeString(email);
  
  // Convert to lowercase and trim
  return sanitized.toLowerCase().trim();
}

/**
 * Sanitize phone number - remove non-digit characters except + and spaces
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  // Remove HTML/JS first
  const sanitized = sanitizeString(phone);
  
  // Keep only digits, +, spaces, hyphens, parentheses
  return sanitized.replace(/[^\d+\s\-()]/g, '').trim();
}

/**
 * Sanitize text input (for names, subjects, etc.)
 */
export function sanitizeText(input: string, maxLength?: number): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const sanitized = sanitizeString(input);
  
  // Apply length limit if provided
  if (maxLength && sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitize message/content (allows some basic formatting but removes scripts)
 */
export function sanitizeMessage(input: string, maxLength?: number): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // More strict - remove all HTML
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  const trimmed = sanitized.trim();
  
  // Apply length limit if provided
  if (maxLength && trimmed.length > maxLength) {
    return trimmed.substring(0, maxLength);
  }

  return trimmed;
}

/**
 * Sanitize object - recursively sanitize all string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      // Apply appropriate sanitization based on field name
      if (key.includes('email')) {
        sanitized[key] = sanitizeEmail(sanitized[key]) as any;
      } else if (key.includes('phone')) {
        sanitized[key] = sanitizePhone(sanitized[key]) as any;
      } else if (key.includes('message') || key.includes('description')) {
        sanitized[key] = sanitizeMessage(sanitized[key]) as any;
      } else {
        sanitized[key] = sanitizeText(sanitized[key]) as any;
      }
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]) as any;
    }
  }

  return sanitized;
}

