/**
 * GET /api/public/categories/slug/:slug
 * Get category by slug (public)
 */

import { CategoryController } from '@/backend/controllers/category';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  return CategoryController.getBySlug(request as any, { slug });
}
