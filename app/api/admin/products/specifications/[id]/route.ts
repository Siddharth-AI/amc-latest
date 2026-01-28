/**
 * PUT /api/admin/products/specifications/:id
 * DELETE /api/admin/products/specifications/:id
 * Update/Delete product specification (admin)
 */

import { ProductController } from '@/backend/controllers/product';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.updateSpecification(request as any, { id });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.deleteSpecification(request as any, { id });
}

