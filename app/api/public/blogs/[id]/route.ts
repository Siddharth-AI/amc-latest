/**
 * GET /api/public/blogs/:id
 * Get blog by ID with tags (public)
 */

import { BlogController } from '@/backend/controllers/blog';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return BlogController.getById(request as any, { id });
}

