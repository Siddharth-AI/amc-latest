/**
 * GET /api/public/products/:id
 * Get product by ID with details (public)
 */

import { ProductController } from '@/backend/controllers/product';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.getById(request as any, { id });
}

