/**
 * POST /api/public/enquiry
 * Create enquiry (public)
 */

import { EnquiryController } from '@/backend/controllers/enquiry';

export async function POST(request: Request) {
  return EnquiryController.create(request as any);
}

