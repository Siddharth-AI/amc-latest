/**
 * Enquiry Validators
 * Zod schemas for enquiry operations with enhanced security
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
      // Basic email format check
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
      // Allow international format: +1234567890 or digits only
      const phoneRegex = /^[\d+\s\-()]+$/;
      return phoneRegex.test(phone);
    },
    { message: 'Invalid phone number format' }
  );

export const createEnquirySchema = z.object({
  category_id: z
    .string()
    .uuid('Invalid category ID')
    .optional()
    .nullable(),
  product_id: z
    .string()
    .uuid('Invalid product ID')
    .optional()
    .nullable(),
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
  company_name: z
    .string()
    .max(100, 'Company name is too long')
    .trim()
    .optional()
    .nullable()
    .refine(
      (name) => {
        if (!name) return true;
        return !/<[^>]*>/g.test(name);
      },
      { message: 'Invalid characters in company name' }
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

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;

