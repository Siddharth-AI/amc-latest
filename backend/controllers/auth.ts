/**
 * Auth Controller
 * Request handling for authentication
 */

import { NextRequest } from 'next/server';
import { AuthService } from '@/backend/services/auth';
import { loginSchema, refreshTokenSchema, registerSchema } from '@/validators/auth';
import { successResponse, errorResponse, sendResponse } from '@/utils/response';

export class AuthController {
  /**
   * POST /api/auth/register
   * Register new admin user
   */
  static async register(request: NextRequest) {
    try {
      const body = await request.json();
      const validatedData = registerSchema.parse(body);

      const result = await AuthService.register(validatedData);

      return sendResponse(
        new Response(),
        201,
        'Admin registered successfully',
        result
      );
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return sendResponse(
          new Response(),
          400,
          'Validation error',
          undefined,
          error.errors[0].message
        );
      }

      return sendResponse(
        new Response(),
        400,
        error.message || 'Registration failed',
        undefined,
        error.message
      );
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(request: NextRequest) {
    try {
      const body = await request.json();
      const validatedData = loginSchema.parse(body);

      const result = await AuthService.login(validatedData);

      return sendResponse(
        new Response(),
        200,
        'Login successful',
        result
      );
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return sendResponse(
          new Response(),
          400,
          'Validation error',
          undefined,
          error.errors[0].message
        );
      }

      return sendResponse(
        new Response(),
        401,
        error.message || 'Login failed',
        undefined,
        error.message
      );
    }
  }

  /**
   * POST /api/auth/refresh
   */
  static async refresh(request: NextRequest) {
    try {
      const body = await request.json();
      const validatedData = refreshTokenSchema.parse(body);

      const result = await AuthService.refreshToken(validatedData.refreshToken);

      return sendResponse(
        new Response(),
        200,
        'Token refreshed successfully',
        result
      );
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return sendResponse(
          new Response(),
          400,
          'Validation error',
          undefined,
          error.errors[0].message
        );
      }

      return sendResponse(
        new Response(),
        401,
        error.message || 'Token refresh failed',
        undefined,
        error.message
      );
    }
  }
}

