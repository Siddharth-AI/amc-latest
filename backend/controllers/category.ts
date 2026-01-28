/**
 * Category Controller
 * Request handling for categories
 */

import { NextRequest } from 'next/server';
import { CategoryService } from '@/backend/services/category';
import { CategoryModel } from '@/backend/models/category';
import { createCategorySchema, updateCategorySchema } from '@/validators/category';
import { authenticateRequest } from '@/middlewares/auth';
import { sendResponse } from '@/utils/response';

export class CategoryController {
  /**
   * GET /api/public/categories
   * Get all active categories with pagination (public)
   */
  static async getAll(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '12');

      const result = await CategoryModel.findAllPaginated(page, limit);
      return sendResponse(new Response(), 200, 'Categories fetched successfully', result);
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        'Failed to fetch categories',
        undefined,
        error.message
      );
    }
  }

  /**
   * GET /api/public/categories/slug/:slug
   * Get category by slug (public)
   */
  static async getBySlug(request: NextRequest, { slug }: { slug: string }) {
    try {
      const category = await CategoryModel.findBySlug(slug);

      if (!category) {
        return sendResponse(new Response(), 404, 'Category not found');
      }

      return sendResponse(new Response(), 200, 'Category fetched successfully', category);
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        'Failed to fetch category',
        undefined,
        error.message
      );
    }
  }

  /**
   * GET /api/public/categories/:id
   * Get category by ID (public)
   */
  static async getById(request: NextRequest, { id }: { id: string }) {
    try {
      const category = await CategoryService.getCategoryById(id);

      if (!category) {
        return sendResponse(new Response(), 404, 'Category not found');
      }

      return sendResponse(new Response(), 200, 'Category fetched successfully', category);
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        'Failed to fetch category',
        undefined,
        error.message
      );
    }
  }

  /**
   * POST /api/admin/categories
   * Create category (admin)
   */
  static async create(request: NextRequest) {
    try {
      // Authenticate
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      // Parse form data
      const formData = await request.formData();
      const name = formData.get('name') as string;
      const title = formData.get('title') as string | null;
      const slug = formData.get('slug') as string | null;
      const imageFile = formData.get('image') as File | null;

      // Validate
      const validatedData = createCategorySchema.parse({
        name,
        title: title || undefined,
        slug: slug || undefined,
      });

      const category = await CategoryService.createCategory(
        validatedData,
        imageFile,
        user.userId
      );

      return sendResponse(new Response(), 201, 'Category created successfully', category);
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
        500,
        error.message || 'Failed to create category',
        undefined,
        error.message
      );
    }
  }

  /**
   * PUT /api/admin/categories/:id
   * Update category (admin)
   */
  static async update(request: NextRequest, { id }: { id: string }) {
    try {
      // Authenticate
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      // Parse form data
      const formData = await request.formData();
      const name = formData.get('name') as string | null;
      const title = formData.get('title') as string | null;
      const slug = formData.get('slug') as string | null;
      const imageFile = formData.get('image') as File | null;

      // Validate
      const validatedData = updateCategorySchema.parse({
        name: name || undefined,
        title: title || undefined,
        slug: slug || undefined,
      });

      const category = await CategoryService.updateCategory(
        id,
        validatedData,
        imageFile,
        user.userId
      );

      return sendResponse(new Response(), 200, 'Category updated successfully', category);
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
        500,
        error.message || 'Failed to update category',
        undefined,
        error.message
      );
    }
  }

  /**
   * DELETE /api/admin/categories/:id
   * Delete category (admin - soft delete)
   */
  static async delete(request: NextRequest, { id }: { id: string }) {
    try {
      // Authenticate
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      await CategoryService.deleteCategory(id, user.userId);

      return sendResponse(new Response(), 200, 'Category deleted successfully');
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to delete category',
        undefined,
        error.message
      );
    }
  }

  /**
   * PATCH /api/admin/categories/:id/toggle-status
   * Toggle category status (active/inactive)
   */
  static async toggleStatus(request: NextRequest, { id }: { id: string }) {
    try {
      // Authenticate
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      const body = await request.json();
      const { isActive } = body;

      if (typeof isActive !== 'boolean') {
        return sendResponse(new Response(), 400, 'isActive must be a boolean');
      }

      const category = await CategoryService.toggleStatus(id, isActive, user.userId);

      return sendResponse(
        new Response(),
        200,
        `Category ${isActive ? 'activated' : 'deactivated'} successfully`,
        category
      );
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to toggle category status',
        undefined,
        error.message
      );
    }
  }

  /**
   * DELETE /api/admin/categories/:id/hard-delete
   * Hard delete category (admin - delete from Cloudinary and database)
   */
  static async hardDelete(request: NextRequest, { id }: { id: string }) {
    try {
      // Authenticate
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      await CategoryService.hardDeleteCategory(id, user.userId);

      return sendResponse(new Response(), 200, 'Category permanently deleted successfully');
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to delete category',
        undefined,
        error.message
      );
    }
  }
}

