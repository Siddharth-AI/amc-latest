/**
 * GET /api/admin/contacts/:id
 * Get contact by ID (admin)
 */

import { ContactController } from '@/backend/controllers/contact';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return ContactController.getById(request as any, { id });
}

