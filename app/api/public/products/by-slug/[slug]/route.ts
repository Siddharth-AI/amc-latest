/**
 * GET /api/public/products/by-slug/:slug
 * Get product by slug with full details (public)
 */

import { ProductController } from '@/backend/controllers/product';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return ProductController.getBySlug(request as any, { slug });
}
