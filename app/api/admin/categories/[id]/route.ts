/**
 * GET /api/admin/categories/:id
 * PUT /api/admin/categories/:id
 * DELETE /api/admin/categories/:id
 * Get/Update/Delete category (admin)
 */

import { CategoryController } from '@/backend/controllers/category';
import { CategoryService } from '@/backend/services/category';
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
    
    // Get category by ID (admin can see inactive/deleted)
    const category = await CategoryService.getCategoryByIdAdmin(id);

    if (!category) {
      return sendResponse(new Response(), 404, 'Category not found');
    }

    return sendResponse(new Response(), 200, 'Category fetched successfully', category);
  } catch (error: any) {
    return sendResponse(
      new Response(),
      500,
      'Failed to fetch category',
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
  return CategoryController.update(request as any, { id });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return CategoryController.delete(request as any, { id });
}

