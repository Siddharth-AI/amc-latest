/**
 * POST /api/auth/login
 * Admin login endpoint
 */

import { AuthController } from '@/backend/controllers/auth';

export async function POST(request: Request) {
  return AuthController.login(request as any);
}

