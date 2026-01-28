/**
 * GET /api/admin/blogs/:id
 * PUT /api/admin/blogs/:id
 * DELETE /api/admin/blogs/:id
 * Get/Update/Delete blog (admin)
 */

import { BlogController } from '@/backend/controllers/blog';
import { BlogService } from '@/backend/services/blog';
import { authenticateRequest } from '@/middlewares/auth';
import { sendResponse } from '@/utils/response';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate
    const authResult = await authenticateRequest(request as any);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { id } = await params;
    
    // Get blog by ID (admin can see inactive/deleted)
    const blog = await BlogService.getBlogByIdAdmin(id);

    if (!blog) {
      return sendResponse(new Response(), 404, 'Blog not found');
    }

    return sendResponse(new Response(), 200, 'Blog fetched successfully', blog);
  } catch (error: any) {
    return sendResponse(
      new Response(),
      500,
      'Failed to fetch blog',
      undefined,
      error.message
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return BlogController.update(request as any, { id });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return BlogController.delete(request as any, { id });
}

