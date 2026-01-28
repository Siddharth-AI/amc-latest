/**
 * Product Model
 * Database queries for products
 */

import { supabaseAdmin } from '@/lib/supabase';
import type { Product, ProductImage, ProductKeyFeature, ProductSpecification, ProductWithDetails } from '@/types';

export class ProductModel {
  /**
   * Get all active products
   */
  static async findAll(categoryId?: string): Promise<Product[]> {
    let query = supabaseAdmin!
      .from('product')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return (data || []) as Product[];
  }

  /**
   * Get all products (admin - no filters)
   */
  static async findAllAdmin(): Promise<Product[]> {
    const { data, error } = await supabaseAdmin!
      .from('product')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return (data || []) as Product[];
  }

  /**
   * Get all products with pagination (admin) - includes images, specifications, features
   */
  static async findAllAdminPaginated(page: number = 1, limit: number = 10, includeDeleted: boolean = false): Promise<{
    data: any[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const offset = (page - 1) * limit;

    // Get total count
    let countQuery = supabaseAdmin!.from('product').select('*', { count: 'exact', head: true });

    if (!includeDeleted) {
      countQuery = countQuery.eq('is_deleted', false);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      throw new Error(`Failed to count products: ${countError.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    let dataQuery = supabaseAdmin!
      .from('product')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!includeDeleted) {
      dataQuery = dataQuery.eq('is_deleted', false);
    }

    const { data, error } = await dataQuery;

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    // Fetch related data for each product
    const productsWithDetails = await Promise.all(
      (data || []).map(async (product) => {
        // Get images (admin - no is_active filter)
        const { data: images, error: imagesError } = await supabaseAdmin!
          .from('product_image')
          .select('*')
          .eq('product_id', product.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: true });

        // Debug log
        if (images && images.length > 0) {
          console.log('Raw images from DB:', images[0]);
        }
        if (imagesError) {
          console.error('Images fetch error:', imagesError);
        }

        // Get specifications
        const { data: specifications } = await supabaseAdmin!
          .from('product_specification')
          .select('id, product_id, specification_key, specification_value')
          .eq('product_id', product.id)
          .eq('is_deleted', false);

        // Get features
        const { data: features } = await supabaseAdmin!
          .from('product_key_feature')
          .select('id, product_id, name')
          .eq('product_id', product.id)
          .eq('is_deleted', false);

        return {
          ...product,
          images: (images || []).map(img => ({
            id: img.id,
            product_id: img.product_id,
            img_original_name: img.original_name,
            base_url: img.base_url,
            img_name: img.name,
            img_type: img.type
          })),
          specifications: (specifications || []).map(s => ({
            id: s.id,
            product_id: s.product_id,
            key: s.specification_key,
            value: s.specification_value
          })),
          features: (features || []).map(f => ({
            id: f.id,
            product_id: f.product_id,
            feature: f.name
          })),
        };
      })
    );

    return {
      data: productsWithDetails,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get product by ID with all details (admin - no filters)
   */
  static async findByIdWithDetailsAdmin(id: string): Promise<ProductWithDetails | null> {
    // Get product
    const { data: product, error: productError } = await supabaseAdmin!
      .from('product')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (productError || !product) {
      return null;
    }

    // Get category
    const { data: category } = await supabaseAdmin!
      .from('category')
      .select('*')
      .eq('id', (product as Product).category_id)
      .single();

    // Get images (admin - no is_active filter)
    const { data: images } = await supabaseAdmin!
      .from('product_image')
      .select('*')
      .eq('product_id', id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    // Get key features (admin - no is_active filter)
    const { data: keyFeatures } = await supabaseAdmin!
      .from('product_key_feature')
      .select('*')
      .eq('product_id', id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    // Get specifications (admin - no is_active filter)
    const { data: specifications } = await supabaseAdmin!
      .from('product_specification')
      .select('*')
      .eq('product_id', id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    return {
      ...(product as Product),
      category: category || undefined,
      images: (images || []) as ProductImage[],
      key_features: (keyFeatures || []) as ProductKeyFeature[],
      specifications: (specifications || []) as ProductSpecification[],
    };
  }

  /**
   * Get product by ID with all details
   */
  static async findByIdWithDetails(id: string): Promise<ProductWithDetails | null> {
    // Get product
    const { data: product, error: productError } = await supabaseAdmin!
      .from('product')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (productError || !product) {
      return null;
    }

    // Get category
    const { data: category } = await supabaseAdmin!
      .from('category')
      .select('*')
      .eq('id', (product as Product).category_id)
      .single();

    // Get images
    const { data: images } = await supabaseAdmin!
      .from('product_image')
      .select('*')
      .eq('product_id', id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    // Get key features
    const { data: keyFeatures } = await supabaseAdmin!
      .from('product_key_feature')
      .select('*')
      .eq('product_id', id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    // Get specifications
    const { data: specifications } = await supabaseAdmin!
      .from('product_specification')
      .select('*')
      .eq('product_id', id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    return {
      ...(product as Product),
      category: category || undefined,
      images: (images || []) as ProductImage[],
      key_features: (keyFeatures || []) as ProductKeyFeature[],
      specifications: (specifications || []) as ProductSpecification[],
    };
  }

  /**
   * Get product by ID (simple)
   */
  static async findById(id: string): Promise<Product | null> {
    const { data, error } = await supabaseAdmin!
      .from('product')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Product;
  }

  /**
   * Get product by slug with all details (public)
   */
  static async findBySlugWithDetails(slug: string): Promise<ProductWithDetails | null> {
    // Get product
    const { data: product, error: productError } = await supabaseAdmin!
      .from('product')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (productError || !product) {
      return null;
    }

    // Get category
    const { data: category } = await supabaseAdmin!
      .from('category')
      .select('*')
      .eq('id', (product as Product).category_id)
      .single();

    // Get images
    const { data: images } = await supabaseAdmin!
      .from('product_image')
      .select('*')
      .eq('product_id', (product as Product).id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    // Get key features
    const { data: keyFeatures } = await supabaseAdmin!
      .from('product_key_feature')
      .select('*')
      .eq('product_id', (product as Product).id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    // Get specifications
    const { data: specifications } = await supabaseAdmin!
      .from('product_specification')
      .select('*')
      .eq('product_id', (product as Product).id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    return {
      ...(product as Product),
      category: category || undefined,
      images: (images || []) as ProductImage[],
      key_features: (keyFeatures || []) as ProductKeyFeature[],
      specifications: (specifications || []) as ProductSpecification[],
    };
  }

  /**
   * Get all products with pagination and filters (public)
   */
  static async findAllPaginated(
    page: number = 1,
    limit: number = 12,
    filters?: {
      category_id?: string;
      search?: string;
      sort_by?: 'name' | 'created_at';
    }
  ): Promise<{
    data: Product[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const offset = (page - 1) * limit;

    // Build query
    let countQuery = supabaseAdmin!
      .from('product')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_deleted', false);

    let dataQuery = supabaseAdmin!
      .from('product')
      .select('*, category:category_id(id, name, slug)')
      .eq('is_active', true)
      .eq('is_deleted', false);

    // Apply filters
    if (filters?.category_id) {
      countQuery = countQuery.eq('category_id', filters.category_id);
      dataQuery = dataQuery.eq('category_id', filters.category_id);
    }

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      countQuery = countQuery.or(`name.ilike.${searchTerm},title.ilike.${searchTerm},description.ilike.${searchTerm}`);
      dataQuery = dataQuery.or(`name.ilike.${searchTerm},title.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }

    // Get total count
    const { count, error: countError } = await countQuery;

    if (countError) {
      throw new Error(`Failed to count products: ${countError.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Apply sorting
    const sortBy = filters?.sort_by || 'created_at';
    dataQuery = dataQuery.order(sortBy, { ascending: sortBy === 'name' });

    // Get paginated data
    const { data, error } = await dataQuery.range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return {
      data: (data || []) as Product[],
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get products by category slug with pagination (public)
   */
  static async findByCategorySlugPaginated(
    categorySlug: string,
    page: number = 1,
    limit: number = 12,
    filters?: {
      search?: string;
      sort_by?: 'name' | 'created_at';
    }
  ): Promise<{
    data: Product[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    // First get category by slug
    const { data: category } = await supabaseAdmin!
      .from('category')
      .select('id')
      .eq('slug', categorySlug)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (!category) {
      return {
        data: [],
        meta: { page, limit, total: 0, totalPages: 0 },
      };
    }

    // Then get products for that category
    return this.findAllPaginated(page, limit, {
      category_id: category.id,
      ...filters,
    });
  }

  /**
   * Create product
   */
  static async create(productData: {
    category_id: string;
    name: string;
    slug?: string;
    title?: string;
    description?: string;
    is_warranty?: boolean;
    warranty_period?: string;
    created_by?: string;
  }): Promise<Product> {
    const { data, error } = await supabaseAdmin!
      .from('product')
      .insert(productData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return data as Product;
  }

  /**
   * Update product
   */
  static async update(
    id: string,
    productData: {
      category_id?: string;
      name?: string;
      slug?: string;
      title?: string;
      description?: string;
      is_warranty?: boolean;
      warranty_period?: string;
      updated_by?: string;
    }
  ): Promise<Product> {
    const { data, error } = await supabaseAdmin!
      .from('product')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return data as Product;
  }

  /**
   * Soft delete product
   */
  static async softDelete(id: string, updated_by?: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('product')
      .update({
        is_deleted: true,
        updated_by,
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  /**
   * Toggle active status
   */
  static async toggleStatus(id: string, isActive: boolean, updated_by?: string): Promise<Product> {
    const { data, error } = await supabaseAdmin!
      .from('product')
      .update({
        is_active: isActive,
        updated_by,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to toggle product status: ${error.message}`);
    }

    return data as Product;
  }

  /**
   * Hard delete product (permanent delete from database)
   */
  static async hardDelete(id: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('product')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  /**
   * Deactivate all products in a category
   */
  static async deactivateByCategory(categoryId: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('product')
      .update({
        is_active: false,
      })
      .eq('category_id', categoryId)
      .eq('is_deleted', false);

    if (error) {
      throw new Error(`Failed to deactivate products in category: ${error.message}`);
    }
  }

  /**
   * Activate all products in a category (only if not deleted)
   */
  static async activateByCategory(categoryId: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('product')
      .update({
        is_active: true,
      })
      .eq('category_id', categoryId)
      .eq('is_deleted', false);

    if (error) {
      throw new Error(`Failed to activate products in category: ${error.message}`);
    }
  }

  /**
   * Soft delete all products in a category
   */
  static async softDeleteByCategory(categoryId: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('product')
      .update({
        is_deleted: true,
        is_active: false,
      })
      .eq('category_id', categoryId);

    if (error) {
      throw new Error(`Failed to delete products in category: ${error.message}`);
    }
  }
}

export class ProductImageModel {
  /**
   * Get all images for a product (public - only active)
   */
  static async findByProductId(productId: string): Promise<ProductImage[]> {
    const { data, error } = await supabaseAdmin!
      .from('product_image')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch product images: ${error.message}`);
    }

    return (data || []) as ProductImage[];
  }

  /**
   * Get all images for a product (admin - includes deleted)
   */
  static async findByProductIdAdmin(productId: string): Promise<ProductImage[]> {
    const { data, error } = await supabaseAdmin!
      .from('product_image')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch product images: ${error.message}`);
    }

    return (data || []) as ProductImage[];
  }

  /**
   * Create product image
   */
  static async create(imageData: {
    product_id: string;
    original_name: string;
    base_url: string;
    name: string;
    type: string;
    created_by?: string;
  }): Promise<ProductImage> {
    const { data, error } = await supabaseAdmin!
      .from('product_image')
      .insert(imageData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product image: ${error.message}`);
    }

    return data as ProductImage;
  }

  /**
   * Delete product image (soft delete)
   */
  static async softDelete(id: string, updated_by?: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('product_image')
      .update({
        is_deleted: true,
        updated_by,
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product image: ${error.message}`);
    }
  }

  /**
   * Get product image by ID
   */
  static async findById(id: string): Promise<ProductImage | null> {
    const { data, error } = await supabaseAdmin!
      .from('product_image')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as ProductImage;
  }

  /**
   * Hard delete product image (permanent delete from database)
   */
  static async hardDelete(id: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('product_image')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product image: ${error.message}`);
    }
  }
}

export class ProductKeyFeatureModel {
  /**
   * Get all key features for a product
   */
  static async findByProductId(productId: string): Promise<ProductKeyFeature[]> {
    const { data, error } = await supabaseAdmin!
      .from('product_key_feature')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch product key features: ${error.message}`);
    }

    return (data || []) as ProductKeyFeature[];
  }

  /**
   * Create product key feature
   */
  static async create(featureData: {
    product_id: string;
    name: string;
    created_by?: string;
  }): Promise<ProductKeyFeature> {
    const { data, error } = await supabaseAdmin!
      .from('product_key_feature')
      .insert(featureData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product key feature: ${error.message}`);
    }

    return data as ProductKeyFeature;
  }

  /**
   * Update product key feature
   */
  static async update(
    id: string,
    featureData: {
      name?: string;
      updated_by?: string;
    }
  ): Promise<ProductKeyFeature> {
    const { data, error } = await supabaseAdmin!
      .from('product_key_feature')
      .update(featureData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product key feature: ${error.message}`);
    }

    return data as ProductKeyFeature;
  }

  /**
   * Delete product key feature (soft delete)
   */
  static async softDelete(id: string, updated_by?: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('product_key_feature')
      .update({
        is_deleted: true,
        updated_by,
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product key feature: ${error.message}`);
    }
  }
}

export class ProductSpecificationModel {
  /**
   * Get all specifications for a product
   */
  static async findByProductId(productId: string): Promise<ProductSpecification[]> {
    const { data, error } = await supabaseAdmin!
      .from('product_specification')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch product specifications: ${error.message}`);
    }

    return (data || []) as ProductSpecification[];
  }

  /**
   * Create product specification
   */
  static async create(specData: {
    product_id: string;
    specification_key: string;
    specification_value: string;
    created_by?: string;
  }): Promise<ProductSpecification> {
    const { data, error } = await supabaseAdmin!
      .from('product_specification')
      .insert(specData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product specification: ${error.message}`);
    }

    return data as ProductSpecification;
  }

  /**
   * Update product specification
   */
  static async update(
    id: string,
    specData: {
      specification_key?: string;
      specification_value?: string;
      updated_by?: string;
    }
  ): Promise<ProductSpecification> {
    const { data, error } = await supabaseAdmin!
      .from('product_specification')
      .update(specData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product specification: ${error.message}`);
    }

    return data as ProductSpecification;
  }

  /**
   * Delete product specification (soft delete)
   */
  static async softDelete(id: string, updated_by?: string): Promise<void> {
    const { error } = await supabaseAdmin!
      .from('product_specification')
      .update({
        is_deleted: true,
        updated_by,
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product specification: ${error.message}`);
    }
  }
}

