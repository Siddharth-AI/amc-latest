/**
 * Category Service
 * Business logic for categories
 */

import { CategoryModel } from '@/backend/models/category';
import { ProductModel } from '@/backend/models/product';
import { saveFile, deleteFile } from '@/utils/upload';
import { generateSlug, validateSlugFormat, checkSlugUniqueness, ensureUniqueSlug } from '@/utils/slug';
import type { CreateCategoryInput, UpdateCategoryInput } from '@/validators/category';
import type { Category } from '@/types';

export class CategoryService {
  /**
   * Get all active categories (public)
   */
  static async getAllCategories(): Promise<Category[]> {
    return CategoryModel.findAll(false);
  }

  /**
   * Get all categories including inactive/deleted (admin)
   */
  static async getAllCategoriesAdmin(): Promise<Category[]> {
    return CategoryModel.findAllAdmin();
  }

  /**
   * Get all categories with pagination (admin)
   */
  static async getAllCategoriesAdminPaginated(page: number = 1, limit: number = 10, includeDeleted: boolean = false): Promise<{
    data: Category[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return CategoryModel.findAllAdminPaginated(page, limit, includeDeleted);
  }

  /**
   * Get category by ID (public)
   */
  static async getCategoryById(id: string): Promise<Category | null> {
    return CategoryModel.findById(id);
  }

  /**
   * Get category by ID (admin - no filters)
   */
  static async getCategoryByIdAdmin(id: string): Promise<Category | null> {
    return CategoryModel.findByIdAdmin(id);
  }

  /**
   * Create category (admin)
   */
  static async createCategory(
    input: CreateCategoryInput,
    imageFile: File | null,
    userId: string
  ): Promise<Category> {
    let imageData = null;

    // Handle slug
    let slug: string;
    if (input.slug) {
      // Validate format
      if (!validateSlugFormat(input.slug)) {
        throw new Error('Invalid slug format. Use lowercase letters, numbers, and hyphens only.');
      }
      // Check uniqueness
      if (!(await checkSlugUniqueness(input.slug, 'category'))) {
        throw new Error('Slug already exists. Please choose a different slug.');
      }
      slug = input.slug;
    } else {
      // Auto-generate from name
      const baseSlug = generateSlug(input.name);
      slug = await ensureUniqueSlug(baseSlug, 'category');
    }

    // Handle image upload if provided
    if (imageFile) {
      imageData = await saveFile(imageFile, 'categories');
    }
    return CategoryModel.create({
      name: input.name,
      slug,
      title: input.title,
      img_original_name: imageData?.originalName || undefined,
      base_url: imageData?.baseUrl || undefined,
      img_name: imageData?.fileName || undefined,
      img_type: imageData?.fileType || undefined,
      created_by: userId,
    });
  }

  /**
   * Update category (admin)
   */
  static async updateCategory(
    id: string,
    input: UpdateCategoryInput,
    imageFile: File | null,
    userId: string
  ): Promise<Category> {
    const updateData: any = {
      updated_by: userId,
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }
    if (input.title !== undefined) {
      updateData.title = input.title;
    }

    // Handle slug update
    if (input.slug !== undefined) {
      if (input.slug) {
        // Validate format
        if (!validateSlugFormat(input.slug)) {
          throw new Error('Invalid slug format. Use lowercase letters, numbers, and hyphens only.');
        }
        // Check uniqueness (exclude current category)
        if (!(await checkSlugUniqueness(input.slug, 'category', id))) {
          throw new Error('Slug already exists. Please choose a different slug.');
        }
        updateData.slug = input.slug;
      } else if (input.name) {
        // If slug is cleared but name is updated, regenerate from name
        const baseSlug = generateSlug(input.name);
        updateData.slug = await ensureUniqueSlug(baseSlug, 'category', id);
      }
    }

    // Handle image upload if provided (only delete old image if new image is uploaded)
    if (imageFile) {
      // Get existing category to delete old image
      const existingCategory = await CategoryModel.findByIdAdmin(id);

      const imageData = await saveFile(imageFile, 'categories');
      updateData.img_original_name = imageData.originalName;
      updateData.base_url = imageData.baseUrl;
      updateData.img_name = imageData.fileName;
      updateData.img_type = imageData.fileType;

      // Delete old image from Cloudinary if exists
      if (existingCategory?.base_url && existingCategory?.img_name) {
        try {
          const fullUrl = `${existingCategory.base_url}${existingCategory.img_name}`;
          await deleteFile(fullUrl);
        } catch (error) {
          console.error('Failed to delete old image:', error);
        }
      }
    }

    return CategoryModel.update(id, updateData);
  }

  /**
   * Delete category (admin - soft delete)
   */
  static async deleteCategory(id: string, userId: string): Promise<void> {
    // Soft delete the category
    await CategoryModel.softDelete(id, userId);

    // Soft delete all products in this category (set isDeleted=true and isActive=false)
    await ProductModel.softDeleteByCategory(id);
  }

  /**
   * Toggle category status (active/inactive)
   */
  static async toggleStatus(id: string, isActive: boolean, userId: string): Promise<Category> {
    const category = await CategoryModel.toggleStatus(id, isActive, userId);

    // Deactivate products if category is deactivated, activate them if category is reactivated
    if (isActive) {
      await ProductModel.activateByCategory(id);
    } else {
      await ProductModel.deactivateByCategory(id);
    }

    return category;
  }

  /**
   * Hard delete category (admin - delete from Cloudinary and database)
   */
  static async hardDeleteCategory(id: string, userId: string): Promise<void> {
    // Get category to delete image from Cloudinary
    const category = await CategoryModel.findByIdAdmin(id);

    if (!category) {
      throw new Error('Category not found');
    }

    // Soft delete all products in this category first
    await ProductModel.softDeleteByCategory(id);

    // Delete image from Cloudinary if exists
    if (category.base_url && category.img_name) {
      try {
        const fullUrl = `${category.base_url}${category.img_name}`;
        await deleteFile(fullUrl);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
        // Continue even if delete fails
      }
    }

    // Delete from database
    await CategoryModel.hardDelete(id);
  }
}

