/**
 * Product Service
 * Business logic for products
 */

import {
  ProductModel,
  ProductImageModel,
  ProductKeyFeatureModel,
  ProductSpecificationModel,
} from '@/backend/models/product';
import { CategoryModel } from '@/backend/models/category';
import { saveFiles, deleteFile } from '@/utils/upload';
import { generateSlug, validateSlugFormat, checkSlugUniqueness, ensureUniqueSlug } from '@/utils/slug';
import type {
  CreateProductInput,
  UpdateProductInput,
  CreateProductKeyFeatureInput,
  UpdateProductKeyFeatureInput,
  CreateProductSpecificationInput,
  UpdateProductSpecificationInput,
} from '@/validators/product';
import type { Product, ProductWithDetails } from '@/types';

export class ProductService {
  /**
   * Get all products (public)
   */
  static async getAllProducts(categoryId?: string): Promise<Product[]> {
    return ProductModel.findAll(categoryId);
  }

  /**
   * Get all products including inactive/deleted (admin)
   */
  static async getAllProductsAdmin(): Promise<Product[]> {
    return ProductModel.findAllAdmin();
  }

  /**
   * Get all products with pagination (admin)
   */
  static async getAllProductsAdminPaginated(page: number = 1, limit: number = 10, includeDeleted: boolean = false): Promise<{
    data: Product[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return ProductModel.findAllAdminPaginated(page, limit, includeDeleted);
  }

  /**
   * Get product by ID with all details (public)
   */
  static async getProductById(id: string): Promise<ProductWithDetails | null> {
    return ProductModel.findByIdWithDetails(id);
  }

  /**
   * Get product by ID with all details (admin - no filters)
   */
  static async getProductByIdAdmin(id: string): Promise<ProductWithDetails | null> {
    return ProductModel.findByIdWithDetailsAdmin(id);
  }

  /**
   * Create product (admin)
   */
  static async createProduct(
    input: CreateProductInput,
    userId: string
  ): Promise<Product> {
    // Handle slug
    let slug: string;
    if (input.slug) {
      // Validate format
      if (!validateSlugFormat(input.slug)) {
        throw new Error('Invalid slug format. Use lowercase letters, numbers, and hyphens only.');
      }
      // Check uniqueness
      if (!(await checkSlugUniqueness(input.slug, 'product'))) {
        throw new Error('Slug already exists. Please choose a different slug.');
      }
      slug = input.slug;
    } else {
      // Auto-generate from name
      const baseSlug = generateSlug(input.name);
      slug = await ensureUniqueSlug(baseSlug, 'product');
    }

    return ProductModel.create({
      ...input,
      slug,
      created_by: userId,
    });
  }

  /**
   * Update product (admin)
   */
  static async updateProduct(
    id: string,
    input: UpdateProductInput,
    userId: string
  ): Promise<Product> {
    const updateData: any = {
      ...input,
      updated_by: userId,
    };

    // Handle slug update
    if (input.slug !== undefined) {
      if (input.slug) {
        // Validate format
        if (!validateSlugFormat(input.slug)) {
          throw new Error('Invalid slug format. Use lowercase letters, numbers, and hyphens only.');
        }
        // Check uniqueness (exclude current product)
        if (!(await checkSlugUniqueness(input.slug, 'product', id))) {
          throw new Error('Slug already exists. Please choose a different slug.');
        }
        updateData.slug = input.slug;
      } else if (input.name) {
        // If slug is cleared but name is updated, regenerate from name
        const baseSlug = generateSlug(input.name);
        updateData.slug = await ensureUniqueSlug(baseSlug, 'product', id);
      }
    }

    return ProductModel.update(id, updateData);
  }

  /**
   * Delete product (admin - soft delete)
   */
  static async deleteProduct(id: string, userId: string): Promise<void> {
    await ProductModel.softDelete(id, userId);
  }

  /**
   * Toggle product status (active/inactive)
   */
  static async toggleStatus(id: string, isActive: boolean, userId: string): Promise<Product> {
    // First check if the product's category is active and not deleted
    const product = await ProductModel.findByIdWithDetailsAdmin(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const category = await CategoryModel.findByIdAdmin(product.category_id);
    if (!category) {
      throw new Error('Category not found');
    }

    // If category is inactive or deleted, don't allow product activation
    if (isActive && (!category.is_active || category.is_deleted)) {
      throw new Error('Cannot activate product because its category is inactive or deleted. Please activate the category first.');
    }

    return ProductModel.toggleStatus(id, isActive, userId);
  }

  /**
   * Hard delete product (admin - delete images from Cloudinary and database)
   */
  static async hardDeleteProduct(id: string, userId: string): Promise<void> {
    // Get all product images (including deleted ones for hard delete)
    const images = await ProductImageModel.findByProductIdAdmin(id);

    // Delete all images from Cloudinary
    for (const image of images) {
      if (image.base_url && image.name) {
        try {
          const fullUrl = `${image.base_url}${image.name}`;
          await deleteFile(fullUrl);
        } catch (error) {
          console.error('Failed to delete image from Cloudinary:', error);
          // Continue even if delete fails
        }
      }
    }

    // Delete product from database (this will cascade delete related records if foreign keys are set)
    await ProductModel.hardDelete(id);
  }

  /**
   * Upload product images (admin)
   */
  static async uploadProductImages(
    productId: string,
    imageFiles: File[],
    userId: string
  ) {
    const uploadResults = await saveFiles(imageFiles, 'products');

    const images = await Promise.all(
      uploadResults.map((result) =>
        ProductImageModel.create({
          product_id: productId,
          original_name: result.originalName,
          base_url: result.baseUrl, // Store base URL
          name: result.fileName, // Store image path
          type: result.fileType,
          created_by: userId,
        })
      )
    );

    return images;
  }

  /**
   * Delete product image (admin - hard delete)
   */
  static async deleteProductImage(id: string, userId: string): Promise<void> {
    // Get image before deleting
    const image = await ProductImageModel.findById(id);

    if (!image) {
      throw new Error('Product image not found');
    }

    // Delete from Cloudinary if exists
    if (image.base_url && image.name) {
      try {
        // Construct full URL for deletion
        const fullUrl = `${image.base_url}${image.name}`;
        await deleteFile(fullUrl);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
        // Continue even if delete fails
      }
    }

    // Hard delete from database
    await ProductImageModel.hardDelete(id);
  }

  /**
   * Create product key feature (admin)
   */
  static async createProductKeyFeature(
    productId: string,
    input: CreateProductKeyFeatureInput,
    userId: string
  ) {
    return ProductKeyFeatureModel.create({
      product_id: productId,
      name: input.name,
      created_by: userId,
    });
  }

  /**
   * Update product key feature (admin)
   */
  static async updateProductKeyFeature(
    id: string,
    input: UpdateProductKeyFeatureInput,
    userId: string
  ) {
    return ProductKeyFeatureModel.update(id, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.is_active !== undefined && { is_active: input.is_active }),
      updated_by: userId,
    });
  }

  /**
   * Delete product key feature (admin)
   */
  static async deleteProductKeyFeature(id: string, userId: string): Promise<void> {
    await ProductKeyFeatureModel.softDelete(id, userId);
  }

  /**
   * Create product specification (admin)
   */
  static async createProductSpecification(
    productId: string,
    input: CreateProductSpecificationInput,
    userId: string
  ) {
    return ProductSpecificationModel.create({
      product_id: productId,
      specification_key: input.specification_key,
      specification_value: input.specification_value,
      created_by: userId,
    });
  }

  /**
   * Update product specification (admin)
   */
  static async updateProductSpecification(
    id: string,
    input: UpdateProductSpecificationInput,
    userId: string
  ) {
    return ProductSpecificationModel.update(id, {
      ...(input.specification_key !== undefined && { specification_key: input.specification_key }),
      ...(input.specification_value !== undefined && { specification_value: input.specification_value }),
      ...(input.is_active !== undefined && { is_active: input.is_active }),
      updated_by: userId,
    });
  }

  /**
   * Delete product specification (admin)
   */
  static async deleteProductSpecification(id: string, userId: string): Promise<void> {
    await ProductSpecificationModel.softDelete(id, userId);
  }
}

