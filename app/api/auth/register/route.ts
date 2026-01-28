/**
 * POST /api/auth/register
 * Admin registration endpoint
 */

import { AuthController } from '@/backend/controllers/auth';

export async function POST(request: Request) {
  return AuthController.register(request as any);
}

