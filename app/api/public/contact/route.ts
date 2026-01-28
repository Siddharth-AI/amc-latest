/**
 * POST /api/public/contact
 * Create contact form (public)
 */

import { ContactController } from '@/backend/controllers/contact';

export async function POST(request: Request) {
  return ContactController.create(request as any);
}

