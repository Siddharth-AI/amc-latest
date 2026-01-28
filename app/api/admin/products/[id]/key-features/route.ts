/**
 * POST /api/admin/products/:id/key-features
 * Create product key feature (admin)
 */

import { ProductController } from '@/backend/controllers/product';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.createKeyFeature(request as any, { id });
}

