/**
 * DELETE /api/admin/products/images/:id
 * Delete product image (admin)
 */

import { ProductController } from '@/backend/controllers/product';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.deleteImage(request as any, { id });
}

