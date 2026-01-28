/**
 * Blog Validators
 * Zod schemas for blog operations
 */

import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only')
    .optional(),
  description: z.string().min(1, 'Description is required'), // HTML content
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  slug: z.string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only')
    .optional(),
  description: z.string().min(1, 'Description is required').optional(), // HTML content
});

export const createBlogTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
});

export const updateBlogTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type CreateBlogTagInput = z.infer<typeof createBlogTagSchema>;
export type UpdateBlogTagInput = z.infer<typeof updateBlogTagSchema>;

