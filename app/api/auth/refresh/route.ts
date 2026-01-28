/**
 * POST /api/auth/refresh
 * Refresh token endpoint
 */

import { AuthController } from '@/backend/controllers/auth';

export async function POST(request: Request) {
  return AuthController.refresh(request as any);
}

