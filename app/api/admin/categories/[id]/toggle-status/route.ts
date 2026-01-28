/**
 * PATCH /api/admin/categories/:id/toggle-status
 * Toggle category status (active/inactive)
 */

import { CategoryController } from '@/backend/controllers/category';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return CategoryController.toggleStatus(request as any, { id });
}

