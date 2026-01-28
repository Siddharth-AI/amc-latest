/**
 * GET /api/public/blogs/by-slug/:slug
 * Get blog by slug (public)
 */

import { BlogController } from '@/backend/controllers/blog';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return BlogController.getBySlug(request as any, { slug });
}
