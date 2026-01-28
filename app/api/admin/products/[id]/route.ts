/**
 * GET /api/admin/products/:id
 * PUT /api/admin/products/:id
 * DELETE /api/admin/products/:id
 * Get/Update/Delete product (admin)
 */

import { ProductController } from '@/backend/controllers/product';
import { authenticateRequest } from '@/middlewares/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await authenticateRequest(request as any);
  if (authResult instanceof Response) {
    return authResult;
  }
  
  const { id } = await params;
  return ProductController.getByIdAdmin(request as any, { id });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.update(request as any, { id });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ProductController.delete(request as any, { id });
}

