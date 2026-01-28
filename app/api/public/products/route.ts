/**
 * GET /api/public/products
 * Get all products with pagination and filters (public)
 */

import { ProductController } from '@/backend/controllers/product';

export async function GET(request: Request) {
  return ProductController.getAll(request as any);
}

