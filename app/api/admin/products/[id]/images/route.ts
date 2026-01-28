/**
 * POST /api/admin/products/:id/images
 * Upload product images (admin)
 */

import { ProductController } from '@/backend/controllers/product';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.uploadImages(request as any, { id });
}

