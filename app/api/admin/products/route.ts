/**
 * GET /api/admin/products
 * Get all products (admin - includes inactive/deleted) with pagination
 * POST /api/admin/products
 * Create product (admin)
 */

import { ProductController } from '@/backend/controllers/product';
import { ProductService } from '@/backend/services/product';
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

    // Get paginated products (exclude deleted by default)
    const result = await ProductService.getAllProductsAdminPaginated(validPage, validLimit, includeDeleted);

    return sendResponse(new Response(), 200, 'Products fetched successfully', result);
  } catch (error: any) {
    return sendResponse(
      new Response(),
      500,
      'Failed to fetch products',
      undefined,
      error.message
    );
  }
}

export async function POST(request: Request) {
  return ProductController.create(request as any);
}

