/**
 * Product Validators
 * Zod schemas for product operations
 */

import { z } from 'zod';

export const createProductSchema = z.object({
  category_id: z.string().uuid('Invalid category ID'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only')
    .optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  is_warranty: z.boolean().default(false),
  warranty_period: z.string().optional(),
});

export const updateProductSchema = z.object({
  category_id: z.string().uuid('Invalid category ID').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  slug: z.string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only')
    .optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  is_warranty: z.boolean().optional(),
  warranty_period: z.string().optional(),
});

export const createProductKeyFeatureSchema = z.object({
  name: z.string().min(1, 'Feature name is required'),
});

export const updateProductKeyFeatureSchema = z.object({
  name: z.string().min(1, 'Feature name is required').optional(),
  is_active: z.boolean().optional(),
});

export const createProductSpecificationSchema = z.object({
  specification_key: z.string().min(1, 'Specification key is required'),
  specification_value: z.string().min(1, 'Specification value is required'),
});

export const updateProductSpecificationSchema = z.object({
  specification_key: z.string().min(1, 'Specification key is required').optional(),
  specification_value: z.string().min(1, 'Specification value is required').optional(),
  is_active: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateProductKeyFeatureInput = z.infer<typeof createProductKeyFeatureSchema>;
export type UpdateProductKeyFeatureInput = z.infer<typeof updateProductKeyFeatureSchema>;
export type CreateProductSpecificationInput = z.infer<typeof createProductSpecificationSchema>;
export type UpdateProductSpecificationInput = z.infer<typeof updateProductSpecificationSchema>;

