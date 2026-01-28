/**
 * Blog Service
 * Business logic for blogs
 */

import { BlogModel, BlogTagModel } from '@/backend/models/blog';
import { saveFile, deleteFile } from '@/utils/upload';
import { generateSlug, validateSlugFormat, checkSlugUniqueness, ensureUniqueSlug } from '@/utils/slug';
import type {
  CreateBlogInput,
  UpdateBlogInput,
  CreateBlogTagInput,
  UpdateBlogTagInput,
} from '@/validators/blog';
import type { Blog, BlogWithTags } from '@/types';

export class BlogService {
  /**
   * Get all active blogs (public)
   */
  static async getAllBlogs(): Promise<Blog[]> {
    return BlogModel.findAll();
  }

  /**
   * Get all active blogs with pagination (public)
   */
  static async getAllBlogsPaginated(page: number = 1, limit: number = 12): Promise<{
    data: Blog[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return BlogModel.findAllPaginated(page, limit);
  }

  /**
   * Get blog by slug with tags (public)
   */
  static async getBlogBySlug(slug: string): Promise<BlogWithTags | null> {
    return BlogModel.findBySlugWithTags(slug);
  }

  /**
   * Get all blogs including inactive/deleted (admin)
   */
  static async getAllBlogsAdmin(): Promise<Blog[]> {
    return BlogModel.findAllAdmin();
  }

  /**
   * Get all blogs with pagination (admin)
   */
  static async getAllBlogsAdminPaginated(page: number = 1, limit: number = 10, includeDeleted: boolean = false): Promise<{
    data: Blog[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return BlogModel.findAllAdminPaginated(page, limit, includeDeleted);
  }

  /**
   * Get blog by ID with tags (public)
   */
  static async getBlogById(id: string): Promise<BlogWithTags | null> {
    return BlogModel.findByIdWithTags(id);
  }

  /**
   * Get blog by ID with tags (admin - no filters)
   */
  static async getBlogByIdAdmin(id: string): Promise<BlogWithTags | null> {
    return BlogModel.findByIdWithTagsAdmin(id);
  }

  /**
   * Create blog (admin)
   */
  static async createBlog(
    input: CreateBlogInput,
    imageFile: File | null,
    userId: string
  ): Promise<Blog> {
    let imageData = null;

    // Handle slug
    let slug: string;
    if (input.slug) {
      if (!validateSlugFormat(input.slug)) {
        throw new Error('Invalid slug format. Use lowercase letters, numbers, and hyphens only.');
      }
      if (!(await checkSlugUniqueness(input.slug, 'blog'))) {
        throw new Error('Slug already exists. Please choose a different slug.');
      }
      slug = input.slug;
    } else {
      const baseSlug = generateSlug(input.title);
      slug = await ensureUniqueSlug(baseSlug, 'blog');
    }

    // Handle image upload if provided
    if (imageFile) {
      imageData = await saveFile(imageFile, 'blogs');
    }

    return BlogModel.create({
      title: input.title,
      slug,
      description: input.description,
      img_original_name: imageData?.originalName || undefined,
      base_url: imageData?.baseUrl || undefined,
      img_name: imageData?.fileName || undefined,
      img_type: imageData?.fileType || undefined,
      created_by: userId,
    });
  }

  /**
   * Update blog (admin)
   */
  static async updateBlog(
    id: string,
    input: UpdateBlogInput,
    imageFile: File | null,
    userId: string
  ): Promise<Blog> {
    const updateData: any = {
      updated_by: userId,
    };

    if (input.title !== undefined) {
      updateData.title = input.title;
    }
    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    // Handle slug update
    if (input.slug !== undefined) {
      if (input.slug) {
        if (!validateSlugFormat(input.slug)) {
          throw new Error('Invalid slug format. Use lowercase letters, numbers, and hyphens only.');
        }
        if (!(await checkSlugUniqueness(input.slug, 'blog', id))) {
          throw new Error('Slug already exists. Please choose a different slug.');
        }
        updateData.slug = input.slug;
      } else if (input.title) {
        const baseSlug = generateSlug(input.title);
        updateData.slug = await ensureUniqueSlug(baseSlug, 'blog', id);
      }
    }

    // Handle image upload if provided
    if (imageFile) {
      const existingBlog = await BlogModel.findById(id);

      const imageData = await saveFile(imageFile, 'blogs');
      updateData.img_original_name = imageData.originalName;
      updateData.base_url = imageData.baseUrl;
      updateData.img_name = imageData.fileName;
      updateData.img_type = imageData.fileType;

      if (existingBlog?.base_url && existingBlog?.img_name) {
        try {
          const fullUrl = `${existingBlog.base_url}${existingBlog.img_name}`;
          await deleteFile(fullUrl);
        } catch (error) {
          console.error('Failed to delete old image:', error);
        }
      }
    }

    return BlogModel.update(id, updateData);
  }

  /**
   * Delete blog (admin - soft delete)
   */
  static async deleteBlog(id: string, userId: string): Promise<void> {
    await BlogModel.softDelete(id, userId);
  }

  /**
   * Toggle blog status (active/inactive)
   */
  static async toggleStatus(id: string, isActive: boolean, userId: string): Promise<Blog> {
    return BlogModel.toggleStatus(id, isActive, userId);
  }

  /**
   * Hard delete blog (admin - delete image from Cloudinary and database)
   */
  static async hardDeleteBlog(id: string, userId: string): Promise<void> {
    // Get blog to delete image from Cloudinary
    const blog = await BlogModel.findById(id);

    if (!blog) {
      throw new Error('Blog not found');
    }

    // Delete image from Cloudinary if exists
    if (blog.base_url && blog.img_name) {
      try {
        const fullUrl = `${blog.base_url}${blog.img_name}`;
        await deleteFile(fullUrl);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
        // Continue even if delete fails
      }
    }

    // Delete from database
    await BlogModel.hardDelete(id);
  }

  /**
   * Create blog tag (admin)
   */
  static async createBlogTag(
    blogId: string,
    input: CreateBlogTagInput,
    userId: string
  ) {
    return BlogTagModel.create({
      blog_id: blogId,
      name: input.name,
      created_by: userId,
    });
  }

  /**
   * Update blog tag (admin)
   */
  static async updateBlogTag(
    id: string,
    input: UpdateBlogTagInput,
    userId: string
  ) {
    return BlogTagModel.update(id, {
      name: input.name,
      updated_by: userId,
    });
  }

  /**
   * Delete blog tag (admin)
   */
  static async deleteBlogTag(id: string, userId: string): Promise<void> {
    await BlogTagModel.softDelete(id, userId);
  }
}

