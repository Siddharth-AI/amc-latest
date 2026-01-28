/**
 * Auth Service
 * Business logic for authentication
 */

import { AdminModel } from '@/backend/models/admin';
import { comparePassword, hashPassword } from '@/lib/bcrypt';
import { signAccessToken, signRefreshToken, JWTPayload } from '@/lib/jwt';
import type { LoginInput, RegisterInput } from '@/validators/auth';

export class AuthService {
  /**
   * Register new admin user
   */
  static async register(input: RegisterInput): Promise<{
    user: {
      id: string;
      email: string;
      full_name: string;
      role: string;
    };
    message: string;
  }> {
    // Check if admin with email already exists
    const existingAdmin = await AdminModel.findByEmail(input.email);

    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(input.password);

    // Create admin user
    const admin = await AdminModel.create({
      full_name: input.full_name,
      email: input.email,
      password: hashedPassword,
      role: input.role || 'admin',
    });

    return {
      user: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
      message: 'Admin registered successfully',
    };
  }

  /**
   * Login admin user
   */
  static async login(input: LoginInput): Promise<{
    user: {
      id: string;
      email: string;
      full_name: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  }> {
    // Find admin by email
    const admin = await AdminModel.findByEmail(input.email);

    if (!admin) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(input.password, admin.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const payload: JWTPayload = {
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return {
      user: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { verifyRefreshToken, signAccessToken, signRefreshToken } = await import('@/lib/jwt');
    
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Verify user still exists and is active
    const admin = await AdminModel.findById(payload.userId);

    if (!admin) {
      throw new Error('User not found');
    }

    // Generate new tokens
    const newPayload: JWTPayload = {
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

