/**
 * PATCH /api/admin/blogs/:id/toggle-status
 * Toggle blog status (active/inactive)
 */

import { BlogController } from '@/backend/controllers/blog';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return BlogController.toggleStatus(request as any, { id });
}

