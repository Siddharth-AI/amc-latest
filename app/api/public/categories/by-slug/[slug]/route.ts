/**
 * GET /api/public/categories/by-slug/:slug
 * Get category by slug (public)
 */

import { CategoryController } from '@/backend/controllers/category';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return CategoryController.getBySlug(request as any, { slug });
}
