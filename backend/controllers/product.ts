/**
 * Product Controller
 * Request handling for products
 */

import { NextRequest } from 'next/server';
import { ProductService } from '@/backend/services/product';
import { ProductModel } from '@/backend/models/product';
import {
  createProductSchema,
  updateProductSchema,
  createProductKeyFeatureSchema,
  updateProductKeyFeatureSchema,
  createProductSpecificationSchema,
  updateProductSpecificationSchema,
} from '@/validators/product';
import { authenticateRequest } from '@/middlewares/auth';
import { sendResponse } from '@/utils/response';

export class ProductController {
  /**
   * GET /api/public/products
   * Get all products with pagination and filters (public)
   */
  static async getAll(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '12');
      const category_id = searchParams.get('category_id') || undefined;
      const search = searchParams.get('search') || undefined;
      const sort_by = (searchParams.get('sort_by') as 'name' | 'created_at') || undefined;

      const result = await ProductModel.findAllPaginated(page, limit, {
        category_id,
        search,
        sort_by,
      });
      return sendResponse(new Response(), 200, 'Softwares fetched successfully', result);
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        'Failed to fetch products',
        undefined,
        error.message
      );
    }
  }

  /**
   * GET /api/public/products/slug/:slug
   * Get product by slug with full details (public)
   */
  static async getBySlug(request: NextRequest, { slug }: { slug: string }) {
    try {
      const product = await ProductModel.findBySlugWithDetails(slug);

      if (!product) {
        return sendResponse(new Response(), 404, 'Product not found');
      }

      return sendResponse(new Response(), 200, 'Product fetched successfully', product);
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        'Failed to fetch product',
        undefined,
        error.message
      );
    }
  }

  /**
   * GET /api/public/products/:id
   * Get product by ID with details (public)
   */
  static async getById(request: NextRequest, { id }: { id: string }) {
    try {
      const product = await ProductService.getProductById(id);

      if (!product) {
        return sendResponse(new Response(), 404, 'Product not found');
      }

      return sendResponse(new Response(), 200, 'Product fetched successfully', product);
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        'Failed to fetch product',
        undefined,
        error.message
      );
    }
  }

  /**
   * GET /api/admin/products/:id
   * Get product by ID with details (admin - no filters)
   */
  static async getByIdAdmin(request: NextRequest, { id }: { id: string }) {
    try {
      const product = await ProductService.getProductByIdAdmin(id);

      if (!product) {
        return sendResponse(new Response(), 404, 'Product not found');
      }

      return sendResponse(new Response(), 200, 'Product fetched successfully', product);
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        'Failed to fetch product',
        undefined,
        error.message
      );
    }
  }

  /**
   * POST /api/admin/products
   * Create product (admin)
   */
  static async create(request: NextRequest) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      const body = await request.json();
      const validatedData = createProductSchema.parse(body);

      const product = await ProductService.createProduct(validatedData, user.userId);

      return sendResponse(new Response(), 201, 'Product created successfully', product);
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
        error.message || 'Failed to create product',
        undefined,
        error.message
      );
    }
  }

  /**
   * PUT /api/admin/products/:id
   * Update product (admin)
   */
  static async update(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      const body = await request.json();
      const validatedData = updateProductSchema.parse(body);

      const product = await ProductService.updateProduct(id, validatedData, user.userId);

      return sendResponse(new Response(), 200, 'Product updated successfully', product);
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
        error.message || 'Failed to update product',
        undefined,
        error.message
      );
    }
  }

  /**
   * DELETE /api/admin/products/:id
   * Delete product (admin)
   */
  static async delete(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      await ProductService.deleteProduct(id, user.userId);

      return sendResponse(new Response(), 200, 'Product deleted successfully');
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to delete product',
        undefined,
        error.message
      );
    }
  }

  /**
   * PATCH /api/admin/products/:id/toggle-status
   * Toggle product status (active/inactive)
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

      const product = await ProductService.toggleStatus(id, isActive, user.userId);

      return sendResponse(
        new Response(),
        200,
        `Product ${isActive ? 'activated' : 'deactivated'} successfully`,
        product
      );
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to toggle product status',
        undefined,
        error.message
      );
    }
  }

  /**
   * DELETE /api/admin/products/:id/hard-delete
   * Hard delete product (admin - delete images from Cloudinary and database)
   */
  static async hardDelete(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      await ProductService.hardDeleteProduct(id, user.userId);

      return sendResponse(new Response(), 200, 'Product permanently deleted successfully');
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to delete product',
        undefined,
        error.message
      );
    }
  }

  /**
   * POST /api/admin/products/:id/images
   * Upload product images (admin)
   */
  static async uploadImages(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      const formData = await request.formData();
      const imageFiles = formData.getAll('images') as File[];

      if (imageFiles.length === 0) {
        return sendResponse(
          new Response(),
          400,
          'No images provided',
          undefined,
          'At least one image is required'
        );
      }

      const images = await ProductService.uploadProductImages(id, imageFiles, user.userId);

      return sendResponse(new Response(), 201, 'Images uploaded successfully', images);
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to upload images',
        undefined,
        error.message
      );
    }
  }

  /**
   * DELETE /api/admin/products/images/:id
   * Delete product image (admin)
   */
  static async deleteImage(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      await ProductService.deleteProductImage(id, user.userId);

      return sendResponse(new Response(), 200, 'Image deleted successfully');
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to delete image',
        undefined,
        error.message
      );
    }
  }

  /**
   * POST /api/admin/products/:id/key-features
   * Create product key feature (admin)
   */
  static async createKeyFeature(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      const body = await request.json();
      const validatedData = createProductKeyFeatureSchema.parse(body);

      const feature = await ProductService.createProductKeyFeature(
        id,
        validatedData,
        user.userId
      );

      return sendResponse(new Response(), 201, 'Key feature created successfully', feature);
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
        error.message || 'Failed to create key feature',
        undefined,
        error.message
      );
    }
  }

  /**
   * PUT /api/admin/products/key-features/:id
   * Update product key feature (admin)
   */
  static async updateKeyFeature(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      const body = await request.json();
      const validatedData = updateProductKeyFeatureSchema.parse(body);

      const feature = await ProductService.updateProductKeyFeature(
        id,
        validatedData,
        user.userId
      );

      return sendResponse(new Response(), 200, 'Key feature updated successfully', feature);
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
        error.message || 'Failed to update key feature',
        undefined,
        error.message
      );
    }
  }

  /**
   * DELETE /api/admin/products/key-features/:id
   * Delete product key feature (admin)
   */
  static async deleteKeyFeature(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      await ProductService.deleteProductKeyFeature(id, user.userId);

      return sendResponse(new Response(), 200, 'Key feature deleted successfully');
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to delete key feature',
        undefined,
        error.message
      );
    }
  }

  /**
   * POST /api/admin/products/:id/specifications
   * Create product specification (admin)
   */
  static async createSpecification(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      const body = await request.json();
      const validatedData = createProductSpecificationSchema.parse(body);

      const specification = await ProductService.createProductSpecification(
        id,
        validatedData,
        user.userId
      );

      return sendResponse(
        new Response(),
        201,
        'Specification created successfully',
        specification
      );
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
        error.message || 'Failed to create specification',
        undefined,
        error.message
      );
    }
  }

  /**
   * PUT /api/admin/products/specifications/:id
   * Update product specification (admin)
   */
  static async updateSpecification(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      const body = await request.json();
      const validatedData = updateProductSpecificationSchema.parse(body);

      const specification = await ProductService.updateProductSpecification(
        id,
        validatedData,
        user.userId
      );

      return sendResponse(
        new Response(),
        200,
        'Specification updated successfully',
        specification
      );
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
        error.message || 'Failed to update specification',
        undefined,
        error.message
      );
    }
  }

  /**
   * DELETE /api/admin/products/specifications/:id
   * Delete product specification (admin)
   */
  static async deleteSpecification(request: NextRequest, { id }: { id: string }) {
    try {
      const authResult = await authenticateRequest(request);
      if (authResult instanceof Response) {
        return authResult;
      }
      const { user } = authResult;

      await ProductService.deleteProductSpecification(id, user.userId);

      return sendResponse(new Response(), 200, 'Specification deleted successfully');
    } catch (error: any) {
      return sendResponse(
        new Response(),
        500,
        error.message || 'Failed to delete specification',
        undefined,
        error.message
      );
    }
  }
}

