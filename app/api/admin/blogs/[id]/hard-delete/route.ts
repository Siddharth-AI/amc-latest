/**
 * DELETE /api/admin/blogs/:id/hard-delete
 * Hard delete blog (admin - delete image from Cloudinary and database)
 */

import { BlogController } from '@/backend/controllers/blog';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return BlogController.hardDelete(request as any, { id });
}

