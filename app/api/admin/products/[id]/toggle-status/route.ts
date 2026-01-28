/**
 * PATCH /api/admin/products/:id/toggle-status
 * Toggle product status (active/inactive)
 */

import { ProductController } from '@/backend/controllers/product';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.toggleStatus(request as any, { id });
}

