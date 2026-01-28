/**
 * GET /api/public/categories
 * Get all active categories with pagination (public)
 */

import { CategoryController } from '@/backend/controllers/category';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return CategoryController.getAll(request as any);
}

