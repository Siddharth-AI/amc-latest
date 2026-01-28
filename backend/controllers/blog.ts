/**
 * Blog Controller
 * Request handling for blogs
 */

import { NextRequest } from 'next/server';
import { BlogService } from '@/backend/services/blog';
import { createBlogSchema, updateBlogSchema, createBlogTagSchema, updateBlogTagSchema } from '@/validators/blog';
import { authenticateRequest } from '@/middlewares/auth';
import { sendResponse } from '@/utils/response';

export class BlogController {
  /**
   * GET /api/public/blogs
   * Get all active blogs with pagination (public)
   */
  static async getAll(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '12');

      const result = await BlogService.getAllBlogsPaginated(page, limit);
      return sendResponse(new Response(), 200, 'Blogs fetched successfully', result);
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        'Failed to fetch blogs',
        undefined,
        error.message
      );
    }
  }

  /**
   * GET /api/public/blogs/by-slug/:slug
   * Get blog by slug with tags (public)
   */
  static async getBySlug(request: NextRequest, { slug }: { slug: string }) {
    try {
      const blog = await BlogService.getBlogBySlug(slug);

      if (!blog) {
        return sendResponse(new Response(), 404, 'Blog not found');
      }

      return sendResponse(new Response(), 200, 'Blog fetched successfully', blog);
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        'Failed to fetch blog',
        undefined,
        error.message
      );
    }
  }

  /**
   * GET /api/public/blogs/:id
   * Get blog by ID with tags (public)
   */
  static async getById(request: NextRequest, { id }: { id: string }) {
    try {
      const blog = await BlogService.getBlogById(id);

      if (!blog) {
        return sendResponse(new Response(), 404, 'Blog not found');
      }

      return sendResponse(new Response(), 200, 'Blog fetched successfully', blog);
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        'Failed to fetch blog',
        undefined,
        error.message
      );
    }
  }

  /**
   * POST /api/admin/blogs
   * Create blog (admin)
   */
  static async create(request: NextRequest) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      // Parse form data
      const formData = await request.formData();
      const title = formData.get('title') as string;
      const slug = formData.get('slug') as string | null;
      const description = formData.get('description') as string;
      const imageFile = formData.get('image') as File | null;

      // Validate
      const validatedData = createBlogSchema.parse({
        title,
        slug: slug || undefined,
        description,
      });

      const blog = await BlogService.createBlog(validatedData, imageFile, user.userId);

      return sendResponse(new Response(), 201, 'Blog created successfully', blog);
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
        error.message || 'Failed to create blog',
        undefined,
        error.message
      );
    }
  }

  /**
   * PUT /api/admin/blogs/:id
   * Update blog (admin)
   */
  static async update(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      // Parse form data
      const formData = await request.formData();
      const title = formData.get('title') as string | null;
      const slug = formData.get('slug') as string | null;
      const description = formData.get('description') as string | null;
      const imageFile = formData.get('image') as File | null;

      // Validate
      const validatedData = updateBlogSchema.parse({
        title: title || undefined,
        slug: slug || undefined,
        description: description || undefined,
      });

      const blog = await BlogService.updateBlog(id, validatedData, imageFile, user.userId);

      return sendResponse(new Response(), 200, 'Blog updated successfully', blog);
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
        error.message || 'Failed to update blog',
        undefined,
        error.message
      );
    }
  }

  /**
   * DELETE /api/admin/blogs/:id
   * Delete blog (admin - soft delete)
   */
  static async delete(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      await BlogService.deleteBlog(id, user.userId);

      return sendResponse(new Response(), 200, 'Blog deleted successfully');
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to delete blog',
        undefined,
        error.message
      );
    }
  }

  /**
   * PATCH /api/admin/blogs/:id/toggle-status
   * Toggle blog status (active/inactive)
   */
  static async toggleStatus(request: NextRequest, { id }: { id: string }) {
    try {
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

      const blog = await BlogService.toggleStatus(id, isActive, user.userId);

      return sendResponse(
        new Response(),
        200,
        `Blog ${isActive ? 'activated' : 'deactivated'} successfully`,
        blog
      );
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to toggle blog status',
        undefined,
        error.message
      );
    }
  }

  /**
   * DELETE /api/admin/blogs/:id/hard-delete
   * Hard delete blog (admin - delete image from Cloudinary and database)
   */
  static async hardDelete(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      await BlogService.hardDeleteBlog(id, user.userId);

      return sendResponse(new Response(), 200, 'Blog permanently deleted successfully');
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to delete blog',
        undefined,
        error.message
      );
    }
  }

  /**
   * POST /api/admin/blogs/:id/tags
   * Create blog tag (admin)
   */
  static async createTag(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      const body = await request.json();
      const validatedData = createBlogTagSchema.parse(body);

      const tag = await BlogService.createBlogTag(id, validatedData, user.userId);

      return sendResponse(new Response(), 201, 'Blog tag created successfully', tag);
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
        error.message || 'Failed to create blog tag',
        undefined,
        error.message
      );
    }
  }

  /**
   * PUT /api/admin/blogs/tags/:id
   * Update blog tag (admin)
   */
  static async updateTag(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      const body = await request.json();
      const validatedData = updateBlogTagSchema.parse(body);

      const tag = await BlogService.updateBlogTag(id, validatedData, user.userId);

      return sendResponse(new Response(), 200, 'Blog tag updated successfully', tag);
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
        error.message || 'Failed to update blog tag',
        undefined,
        error.message
      );
    }
  }

  /**
   * DELETE /api/admin/blogs/tags/:id
   * Delete blog tag (admin)
   */
  static async deleteTag(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      await BlogService.deleteBlogTag(id, user.userId);

      return sendResponse(new Response(), 200, 'Blog tag deleted successfully');
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to delete blog tag',
        undefined,
        error.message
      );
    }
  }
}

