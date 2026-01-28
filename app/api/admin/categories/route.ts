/**
 * GET /api/admin/categories
 * Get all categories (admin - includes inactive/deleted)
 * POST /api/admin/categories
 * Create category (admin)
 */

import { CategoryController } from '@/backend/controllers/category';
import { CategoryService } from '@/backend/services/category';
import { authenticateRequest } from '@/middlewares/auth';
import { sendResponse } from '@/utils/response';

export async function GET(request: Request) {
  try {
    // Authenticate
    const authResult = await authenticateRequest(request as any);
    if (authResult instanceof Response) {
      return authResult;
    }

    // Get pagination params from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const includeDeleted = searchParams.get('includeDeleted') === 'true';

    // Validate pagination params
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 && limit <= 100 ? limit : 10;

    // Get paginated categories (exclude deleted by default)
    const result = await CategoryService.getAllCategoriesAdminPaginated(validPage, validLimit, includeDeleted);

    return sendResponse(new Response(), 200, 'Categories fetched successfully', result);
  } catch (error: any) {
    return sendResponse(
      new Response(),
      500,
      'Failed to fetch categories',
      undefined,
      error.message
    );
  }
}

export async function POST(request: Request) {
  return CategoryController.create(request as any);
}
