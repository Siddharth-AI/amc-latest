/**
 * Enquiry Controller
 * Request handling for enquiries with security measures
 */

import { NextRequest } from 'next/server';
import { EnquiryService } from '@/backend/services/enquiry';
import { createEnquirySchema } from '@/validators/enquiry';
import { authenticateRequest } from '@/middlewares/auth';
import { sendResponse } from '@/utils/response';
import { rateLimit, rateLimitByEmail } from '@/middlewares/rate-limit';
import { sanitizeObject } from '@/utils/sanitize';
import { addSecurityHeaders } from '@/middlewares/security-headers';
import { NextResponse } from 'next/server';

export class EnquiryController {
  /**
   * POST /api/public/enquiry
   * Create enquiry (public) - with security measures
   */
  static async create(request: NextRequest) {
    try {
      // Rate limiting by IP
      const rateLimitResponse = rateLimit(request, {
        maxRequests: 5, // 5 requests
        windowMs: 60 * 1000, // per minute
        message: 'Too many requests. Please try again later.',
      });

      if (rateLimitResponse) {
        return addSecurityHeaders(rateLimitResponse);
      }

      const body = await request.json();

      // Sanitize input first
      const sanitizedBody = sanitizeObject(body);

      // Validate with Zod
      const validatedData = createEnquirySchema.parse(sanitizedBody);

      // Rate limiting by email (stricter)
      const emailRateLimit = rateLimitByEmail(validatedData.email, {
        maxRequests: 3, // 3 requests
        windowMs: 60 * 60 * 1000, // per hour
      });

      if (!emailRateLimit.allowed) {
        const response = NextResponse.json(
          {
            success: false,
            message: 'Too many requests from this email. Please try again later.',
            error: 'Email rate limit exceeded',
          },
          { status: 429 }
        );
        return addSecurityHeaders(response);
      }

      const enquiry = await EnquiryService.createEnquiry(validatedData);

      const response = NextResponse.json({
        success: true,
        message: 'Enquiry submitted successfully',
        data: enquiry,
      });

      return addSecurityHeaders(response);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const response = NextResponse.json(
          {
            success: false,
            message: 'Validation error',
            error: error.errors[0].message,
          },
          { status: 400 }
        );
        return addSecurityHeaders(response);
      }

      const response = NextResponse.json(
        {
          success: false,
          message: error.message || 'Failed to submit enquiry',
          error: error.message,
        },
        { status: 500 }
      );
      return addSecurityHeaders(response);
    }
  }

  /**
   * GET /api/admin/enquiries
   * Get all enquiries (admin) with pagination
   */
  static async getAll(request: NextRequest) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }

      // Get pagination params from URL
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '10', 10);

      // Validate pagination params
      const validPage = page > 0 ? page : 1;
      const validLimit = limit > 0 && limit <= 100 ? limit : 10;

      const result = await EnquiryService.getAllEnquiriesPaginated(validPage, validLimit);
      const response = NextResponse.json({
        success: true,
        message: 'Enquiries fetched successfully',
        data: result,
      });
      return addSecurityHeaders(response);
    } catch (error: any) {
      const response = NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch enquiries',
          error: error.message,
        },
        { status: 500 }
      );
      return addSecurityHeaders(response);
    }
  }

  /**
   * GET /api/admin/enquiries/:id
   * Get enquiry by ID (admin)
   */
  static async getById(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return addSecurityHeaders(authResult as NextResponse);
      }

      const enquiry = await EnquiryService.getEnquiryById(id);

      if (!enquiry) {
        const response = NextResponse.json(
          {
            success: false,
            message: 'Enquiry not found',
          },
          { status: 404 }
        );
        return addSecurityHeaders(response);
      }

      const response = NextResponse.json({
        success: true,
        message: 'Enquiry fetched successfully',
        data: enquiry,
      });
      return addSecurityHeaders(response);
    } catch (error: any) {
      const response = NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch enquiry',
          error: error.message,
        },
        { status: 500 }
      );
      return addSecurityHeaders(response);
    }
  }
}

