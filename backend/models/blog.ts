/**
 * Blog Model
 * Database queries for blogs
 */

import { supabaseAdmin } from '@/lib/supabase';
import type { Blog, BlogTag, BlogWithTags } from '@/types';

export class BlogModel {
  /**
   * Get all active blogs (public)
   */
  static async findAll(): Promise<Blog[]> {
    const { data, error } = await supabaseAdmin!
      .from('blog')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch blogs: ${error.message}`);
    }

    return (data || []) as Blog[];
  }

  /**
   * Get all blogs (admin - no filters)
   */
  static async findAllAdmin(): Promise<Blog[]> {
    const { data, error } = await supabaseAdmin!
      .from('blog')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch blogs: ${error.message}`);
    }

    return (data || []) as Blog[];
  }

  /**
   * Get all blogs with pagination (admin)
   */
  static async findAllAdminPaginated(page: number = 1, limit: number = 10, includeDeleted: boolean = false): Promise<{
    data: Blog[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const offset = (page - 1) * limit;

    // Get total count
    let countQuery = supabaseAdmin!.from('blog').select('*', { count: 'exact', head: true });

    if (!includeDeleted) {
      countQuery = countQuery.eq('is_deleted', false);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      throw new Error(`Failed to count blogs: ${countError.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    let dataQuery = supabaseAdmin!
      .from('blog')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!includeDeleted) {
      dataQuery = dataQuery.eq('is_deleted', false);
    }

    const { data, error } = await dataQuery;

    if (error) {
      throw new Error(`Failed to fetch blogs: ${error.message}`);
    }

    return {
      data: (data || []) as Blog[],
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get blog by ID (admin - no filters)
   */
  static async findByIdAdmin(id: string): Promise<Blog | null> {
    const { data, error } = await supabaseAdmin!
      .from('blog')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Blog;
  }

  /**
   * Get blog by ID with tags (admin - no filters)
   */
  static async findByIdWithTagsAdmin(id: string): Promise<BlogWithTags | null> {
    // Get blog
    const { data: blog, error: blogError } = await supabaseAdmin!
      .from('blog')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (blogError || !blog) {
      return null;
    }

    // Get tags (admin - no is_active filter)
    const { data: tags } = await supabaseAdmin!
      .from('blog_tag')
      .select('*')
      .eq('blog_id', id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    return {
      ...(blog as Blog),
      tags: (tags || []) as BlogTag[],
    };
  }

  /**
   * Get blog by ID with tags (public)
   */
  static async findByIdWithTags(id: string): Promise<BlogWithTags | null> {
    // Get blog
    const { data: blog, error: blogError } = await supabaseAdmin!
      .from('blog')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (blogError || !blog) {
      return null;
    }

    // Get tags
    const { data: tags } = await supabaseAdmin!
      .from('blog_tag')
      .select('*')
      .eq('blog_id', id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    return {
      ...(blog as Blog),
      tags: (tags || []) as BlogTag[],
    };
  }

  /**
   * Get blog by ID (simple)
   */
  static async findById(id: string): Promise<Blog | null> {
    const { data, error } = await supabaseAdmin!
      .from('blog')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Blog;
  }

  /**
   * Get blog by slug (public)
   */
  static async findBySlug(slug: string): Promise<Blog | null> {
    const { data, error } = await supabaseAdmin!
      .from('blog')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Blog;
  }

  /**
   * Get blog by slug with tags (public)
   */
  static async findBySlugWithTags(slug: string): Promise<BlogWithTags | null> {
    // Get blog
    const { data: blog, error: blogError } = await supabaseAdmin!
      .from('blog')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (blogError || !blog) {
      return null;
    }

    // Get tags
    const { data: tags } = await supabaseAdmin!
      .from('blog_tag')
      .select('*')
      .eq('blog_id', blog.id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    return {
      ...(blog as Blog),
      tags: (tags || []) as BlogTag[],
    };
  }

  /**
   * Get all active blogs with pagination (public)
   */
  static async findAllPaginated(page: number = 1, limit: number = 12): Promise<{
    data: Blog[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const offset = (page - 1) * limit;

    // Get total count (only active, non-deleted)
    const { count, error: countError } = await supabaseAdmin!
      .from('blog')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_deleted', false);

    if (countError) {
      throw new Error(`Failed to count blogs: ${countError.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const { data, error } = await supabaseAdmin!
      .from('blog')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch blogs: ${error.message}`);
    }

    return {
      data: (data || []) as Blog[],
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Create blog
   */
  static async create(blogData: {
    title: string;
    slug?: string;
    description: string; // HTML content
    img_original_name?: string;
    base_url?: string;
    img_name?: string;
    img_type?: string;
    created_by?: string;
  }): Promise<Blog> {
    const { data, error } = await supabaseAdmin!
      .from('blog')
      .insert(blogData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create blog: ${error.message}`);
    }

    return data as Blog;
  }

  /**
   * Update blog
   */
  static async update(
    id: string,
    blogData: {
      title?: string;
      slug?: string;
      description?: string; // HTML content
      img_original_name?: string;
      base_url?: string;
      img_name?: string;
      img_type?: string;
      updated_by?: string;
    }
  ): Promise<Blog> {
    const { data, error } = await supabaseAdmin!
      .from('blog')
      .update(blogData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update blog: ${error.message}`);
    }

    return data as Blog;
  }

  /**
   * Soft delete blog
   */
  static async softDelete(id: string, updated_by?: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('blog')
      .update({
        is_deleted: true,
        is_active: false,
        updated_by,
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete blog: ${error.message}`);
    }
  }

  /**
   * Toggle active status
   */
  static async toggleStatus(id: string, isActive: boolean, updated_by?: string): Promise<Blog> {
    const { data, error } = await supabaseAdmin!
      .from('blog')
      .update({
        is_active: isActive,
        updated_by,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to toggle blog status: ${error.message}`);
    }

    return data as Blog;
  }

  /**
   * Hard delete blog (permanent delete from database)
   */
  static async hardDelete(id: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('blog')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete blog: ${error.message}`);
    }
  }
}

export class BlogTagModel {
  /**
   * Get all tags for a blog
   */
  static async findByBlogId(blogId: string): Promise<BlogTag[]> {
    const { data, error } = await supabaseAdmin!
      .from('blog_tag')
      .select('*')
      .eq('blog_id', blogId)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch blog tags: ${error.message}`);
    }

    return (data || []) as BlogTag[];
  }

  /**
   * Create blog tag
   */
  static async create(tagData: {
    blog_id: string;
    name: string;
    created_by?: string;
  }): Promise<BlogTag> {
    const { data, error } = await supabaseAdmin!
      .from('blog_tag')
      .insert(tagData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create blog tag: ${error.message}`);
    }

    return data as BlogTag;
  }

  /**
   * Update blog tag
   */
  static async update(
    id: string,
    tagData: {
      name?: string;
      updated_by?: string;
    }
  ): Promise<BlogTag> {
    const { data, error } = await supabaseAdmin!
      .from('blog_tag')
      .update(tagData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update blog tag: ${error.message}`);
    }

    return data as BlogTag;
  }

  /**
   * Delete blog tag (soft delete)
   */
  static async softDelete(id: string, updated_by?: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('blog_tag')
      .update({
        is_deleted: true,
        updated_by,
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete blog tag: ${error.message}`);
    }
  }
}

