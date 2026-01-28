/**
 * GET /api/admin/contacts
 * Get all contact forms (admin)
 */

import { ContactController } from '@/backend/controllers/contact';

export async function GET(request: Request) {
  return ContactController.getAll(request as any);
}

