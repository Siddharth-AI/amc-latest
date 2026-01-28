/**
 * Slug Utility Functions
 * Generate and validate URL-friendly slugs
 */

import { supabaseAdmin } from '@/lib/supabase';

/**
 * Generate slug from text
 * Converts to lowercase, replaces spaces with hyphens, removes special chars
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate slug format
 * Only lowercase letters, numbers, and hyphens allowed
 */
export function validateSlugFormat(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Check if slug is unique in database
 */
export async function checkSlugUniqueness(
  slug: string,
  table: 'category' | 'product' | 'blog',
  excludeId?: string
): Promise<boolean> {
  let query = supabaseAdmin!.from(table).select('id').eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query.single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned (slug is unique)
    throw new Error(`Failed to check slug uniqueness: ${error.message}`);
  }

  return !data; // true if no data found (unique)
}

/**
 * Ensure slug is unique by appending numbers if needed
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  table: 'category' | 'product' | 'blog',
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 2;

  while (!(await checkSlugUniqueness(slug, table, excludeId))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
