/**
 * GET /api/public/categories/by-slug/:slug/products
 * Get products by category slug with pagination (public)
 */

import { ProductModel } from '@/backend/models/product';
import { sendResponse } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || undefined;
    const sort_by = (searchParams.get('sort_by') as 'name' | 'created_at') || undefined;

    const result = await ProductModel.findByCategorySlugPaginated(
      slug,
      page,
      limit,
      { search, sort_by }
    );

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
