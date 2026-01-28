/**
 * Category Model
 * Database queries for categories
 */

import { supabaseAdmin } from '@/lib/supabase';
import type { Category } from '@/types';

export class CategoryModel {
  /**
   * Get all active categories (public)
   */
  static async findAll(includeDeleted = false): Promise<Category[]> {
    let query = supabaseAdmin!
      .from('category')
      .select('*')
      .eq('is_active', true);

    if (!includeDeleted) {
      query = query.eq('is_deleted', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return (data || []) as Category[];
  }

  /**
   * Get all categories (admin - no filters)
   */
  static async findAllAdmin(): Promise<Category[]> {
    const { data, error } = await supabaseAdmin!
      .from('category')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return (data || []) as Category[];
  }

  /**
   * Get all categories with pagination (admin)
   */
  static async findAllAdminPaginated(page: number = 1, limit: number = 10, includeDeleted: boolean = false): Promise<{
    data: Category[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const offset = (page - 1) * limit;

    // Get total count
    let countQuery = supabaseAdmin!.from('category').select('*', { count: 'exact', head: true });

    if (!includeDeleted) {
      countQuery = countQuery.eq('is_deleted', false);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      throw new Error(`Failed to count categories: ${countError.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    let dataQuery = supabaseAdmin!
      .from('category')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!includeDeleted) {
      dataQuery = dataQuery.eq('is_deleted', false);
    }

    const { data, error } = await dataQuery;

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return {
      data: (data || []) as Category[],
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get category by ID (public - only active)
   */
  static async findById(id: string): Promise<Category | null> {
    const { data, error } = await supabaseAdmin!
      .from('category')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Category;
  }

  /**
   * Get category by ID (admin - no filters)
   */
  static async findByIdAdmin(id: string): Promise<Category | null> {
    const { data, error } = await supabaseAdmin!
      .from('category')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Category;
  }

  /**
   * Get category by slug (public - only active)
   */
  static async findBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabaseAdmin!
      .from('category')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Category;
  }

  /**
   * Get category by slug (admin - no filters)
   */
  static async findBySlugAdmin(slug: string): Promise<Category | null> {
    const { data, error } = await supabaseAdmin!
      .from('category')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Category;
  }

  /**
   * Get all active categories with pagination (public)
   */
  static async findAllPaginated(page: number = 1, limit: number = 12): Promise<{
    data: Category[];
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
      .from('category')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_deleted', false);

    if (countError) {
      throw new Error(`Failed to count categories: ${countError.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const { data, error } = await supabaseAdmin!
      .from('category')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    const categories = (data || []) as Category[];

    // Fetch product counts for all categories in a single query
    const categoryIds = categories.map(category => category.id);
    const { data: countData, error: productCountError } = await supabaseAdmin!
      .from('product')
      .select('category_id')
      .in('category_id', categoryIds)
      .eq('is_active', true)
      .eq('is_deleted', false);

    if (productCountError) {
      throw new Error(`Failed to fetch product counts: ${productCountError.message}`);
    }

    // Create a map of category_id to product count
    const countMap = new Map<string, number>();
    (countData || []).forEach(item => {
      countMap.set(item.category_id, (countMap.get(item.category_id) || 0) + 1);
    });

    // Add product_count to each category
    const categoriesWithCount = categories.map(category => ({
      ...category,
      product_count: countMap.get(category.id) || 0,
    }));


    return {
      data: categoriesWithCount,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Create category
   */
  static async create(categoryData: {
    name: string;
    slug?: string;
    title?: string;
    img_original_name?: string;
    base_url?: string;
    img_name?: string;
    img_type?: string;
    created_by?: string;
  }): Promise<Category> {
    const { data, error } = await supabaseAdmin!
      .from('category')
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return data as Category;
  }

  /**
   * Update category
   */
  static async update(
    id: string,
    categoryData: {
      name?: string;
      slug?: string;
      title?: string;
      img_original_name?: string;
      base_url?: string;
      img_name?: string;
      img_type?: string;
      updated_by?: string;
    }
  ): Promise<Category> {
    const { data, error } = await supabaseAdmin!
      .from('category')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }

    return data as Category;
  }

  /**
   * Soft delete category
   */
  static async softDelete(id: string, updated_by?: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('category')
      .update({
        is_deleted: true,
        is_active: false,
        updated_by,
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }

  /**
   * Toggle active status
   */
  static async toggleStatus(id: string, isActive: boolean, updated_by?: string): Promise<Category> {
    const { data, error } = await supabaseAdmin!
      .from('category')
      .update({
        is_active: isActive,
        updated_by,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to toggle category status: ${error.message}`);
    }

    return data as Category;
  }

  /**
   * Hard delete category (permanent delete from database)
   */
  static async hardDelete(id: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('category')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }
}

