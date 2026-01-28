/**
 * POST /api/admin/products/:id/specifications
 * Create product specification (admin)
 */

import { ProductController } from '@/backend/controllers/product';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.createSpecification(request as any, { id });
}

