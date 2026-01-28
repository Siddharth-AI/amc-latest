/**
 * PUT /api/admin/blogs/tags/:id
 * DELETE /api/admin/blogs/tags/:id
 * Update/Delete blog tag (admin)
 */

import { BlogController } from '@/backend/controllers/blog';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return BlogController.updateTag(request as any, { id });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return BlogController.deleteTag(request as any, { id });
}

