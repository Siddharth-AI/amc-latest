/**
 * DELETE /api/admin/categories/:id/hard-delete
 * Hard delete category (admin - delete from Cloudinary and database)
 */

import { CategoryController } from '@/backend/controllers/category';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return CategoryController.hardDelete(request as any, { id });
}

