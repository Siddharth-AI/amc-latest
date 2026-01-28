/**
 * POST /api/admin/validate-slug
 * Validate slug uniqueness and format
 */

import { NextRequest } from 'next/server';
import { authenticateRequest } from '@/middlewares/auth';
import { sendResponse } from '@/utils/response';
import { validateSlugFormat, checkSlugUniqueness } from '@/utils/slug';

export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const authResult = await authenticateRequest(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const { slug, table, excludeId } = body;

    // Validate input
    if (!slug || typeof slug !== 'string') {
      return sendResponse(new Response(), 400, 'Slug is required');
    }

    if (!table || !['category', 'product', 'blog'].includes(table)) {
      return sendResponse(new Response(), 400, 'Invalid table name');
    }

    // Check format
    const isValidFormat = validateSlugFormat(slug);
    if (!isValidFormat) {
      return sendResponse(new Response(), 200, 'Slug validation result', {
        isValid: false,
        isUnique: false,
        message: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.',
      });
    }

    // Check uniqueness
    const isUnique = await checkSlugUniqueness(slug, table as 'category' | 'product' | 'blog', excludeId);

    return sendResponse(new Response(), 200, 'Slug validation result', {
      isValid: true,
      isUnique,
      message: isUnique ? 'Slug is available' : 'Slug already exists',
    });
  } catch (error: any) {
    return sendResponse(
      new Response(),
      500,
      'Failed to validate slug',
      undefined,
      error.message
    );
  }
}
