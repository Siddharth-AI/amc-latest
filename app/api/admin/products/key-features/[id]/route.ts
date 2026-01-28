/**
 * PUT /api/admin/products/key-features/:id
 * DELETE /api/admin/products/key-features/:id
 * Update/Delete product key feature (admin)
 */

import { ProductController } from '@/backend/controllers/product';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.updateKeyFeature(request as any, { id });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.deleteKeyFeature(request as any, { id });
}

