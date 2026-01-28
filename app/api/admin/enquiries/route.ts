/**
 * GET /api/admin/enquiries
 * Get all enquiries (admin)
 */

import { EnquiryController } from '@/backend/controllers/enquiry';

export async function GET(request: Request) {
  return EnquiryController.getAll(request as any);
}

