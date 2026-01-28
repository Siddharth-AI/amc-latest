/**
 * Contact Validators
 * Zod schemas for contact operations with enhanced security
 */

import { z } from 'zod';

// Enhanced email validation
const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email is too short')
  .max(100, 'Email is too long')
  .toLowerCase()
  .trim()
  .refine(
    (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    { message: 'Invalid email format' }
  );

// Enhanced phone validation
const phoneSchema = z
  .string()
  .min(1, 'Phone is required')
  .max(20, 'Phone number is too long')
  .refine(
    (phone) => {
      const phoneRegex = /^[\d+\s\-()]+$/;
      return phoneRegex.test(phone);
    },
    { message: 'Invalid phone number format' }
  );

export const createContactSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name is too long')
    .trim()
    .refine(
      (name) => {
        // No HTML tags
        return !/<[^>]*>/g.test(name);
      },
      { message: 'Invalid characters in name' }
    ),
  email: emailSchema,
  phone: phoneSchema,
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject is too long (max 200 characters)')
    .trim()
    .refine(
      (subject) => {
        // No HTML tags or scripts
        return !/<[^>]*>/g.test(subject) && !/<script[^>]*>/gi.test(subject);
      },
      { message: 'Invalid characters in subject' }
    ),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message is too long (max 5000 characters)')
    .trim()
    .refine(
      (message) => {
        // No script tags
        return !/<script[^>]*>/gi.test(message);
      },
      { message: 'Invalid content in message' }
    ),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;

