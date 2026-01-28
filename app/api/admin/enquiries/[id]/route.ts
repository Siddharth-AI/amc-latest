/**
 * GET /api/admin/enquiries/:id
 * Get enquiry by ID (admin)
 */

import { EnquiryController } from '@/backend/controllers/enquiry';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return EnquiryController.getById(request as any, { id });
}

