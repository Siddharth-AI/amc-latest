/**
 * GET /api/public/blogs
 * Get all active blogs (public)
 */

import { BlogController } from '@/backend/controllers/blog';

export async function GET(request: Request) {
  return BlogController.getAll(request as any);
}

