/**
 * DELETE /api/admin/products/:id/hard-delete
 * Hard delete product (admin - delete images from Cloudinary and database)
 */

import { ProductController } from '@/backend/controllers/product';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.hardDelete(request as any, { id });
}

