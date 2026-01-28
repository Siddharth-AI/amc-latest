/**
 * POST /api/admin/blogs/:id/tags
 * Create blog tag (admin)
 */

import { BlogController } from '@/backend/controllers/blog';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return BlogController.createTag(request as any, { id });
}

