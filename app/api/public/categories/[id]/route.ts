/**
 * GET /api/public/categories/:id
 * Get category by ID (public)
 */

import { CategoryController } from '@/backend/controllers/category';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return CategoryController.getById(request as any, { id });
}

