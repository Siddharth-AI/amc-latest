/**
 * Product Slice
 * Manages product state
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  title: string | null;
  description: string | null;
  is_warranty: boolean;
  warranty_period: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  images?: Array<{
    id: string;
    product_id: string;
    img_name: string;
    base_url: string;
    img_original_name: string;
    img_type: string;
  }>;
  specifications?: Array<{
    id: string;
    product_id: string;
    key: string;
    value: string;
  }>;
  features?: Array<{
    id: string;
    product_id: string;
    feature: string;
  }>;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

interface ProductState {
  products: Product[];
  currentProduct: any | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'product/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.products.getAll({ page, limit });
      // API returns { success, message, data: { data: [], meta: {} } }
      return response.data.data as PaginatedResponse<Product>;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Fetch product by ID
export const fetchProductById = createAsyncThunk(
  'product/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.products.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

// Create product
export const createProduct = createAsyncThunk(
  'product/create',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.products.create(data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  'product/update',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.products.update(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

// Delete product (soft delete)
export const deleteProduct = createAsyncThunk(
  'product/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.products.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// Toggle product status
export const toggleProductStatus = createAsyncThunk(
  'product/toggleStatus',
  async ({ id, isActive }: { id: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      const response = await api.products.toggleStatus(id, isActive);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle product status');
    }
  }
);

// Hard delete product
export const hardDeleteProduct = createAsyncThunk(
  'product/hardDelete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.products.hardDelete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// Upload product images
export const uploadProductImages = createAsyncThunk(
  'product/uploadImages',
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await api.products.uploadImages(id, formData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload images');
    }
  }
);

// Delete product image
export const deleteProductImage = createAsyncThunk(
  'product/deleteImage',
  async (imageId: string, { rejectWithValue }) => {
    try {
      await api.products.deleteImage(imageId);
      return imageId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete image');
    }
  }
);

// Add key feature
export const addKeyFeature = createAsyncThunk(
  'product/addKeyFeature',
  async ({ productId, data }: { productId: string; data: { name: string } }, { rejectWithValue }) => {
    try {
      const response = await api.products.createKeyFeature(productId, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add key feature');
    }
  }
);

// Update key feature
export const updateKeyFeature = createAsyncThunk(
  'product/updateKeyFeature',
  async ({ id, data }: { id: string; data: { name?: string; is_active?: boolean } }, { rejectWithValue }) => {
    try {
      const response = await api.products.updateKeyFeature(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update key feature');
    }
  }
);

// Delete key feature
export const deleteKeyFeature = createAsyncThunk(
  'product/deleteKeyFeature',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.products.deleteKeyFeature(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete key feature');
    }
  }
);

// Add specification
export const addSpecification = createAsyncThunk(
  'product/addSpecification',
  async ({ productId, data }: { productId: string; data: { specification_key: string; specification_value: string } }, { rejectWithValue }) => {
    try {
      const response = await api.products.createSpecification(productId, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add specification');
    }
  }
);

// Update specification
export const updateSpecification = createAsyncThunk(
  'product/updateSpecification',
  async ({ id, data }: { id: string; data: { specification_key?: string; specification_value?: string; is_active?: boolean } }, { rejectWithValue }) => {
    try {
      const response = await api.products.updateSpecification(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update specification');
    }
  }
);

// Delete specification
export const deleteSpecification = createAsyncThunk(
  'product/deleteSpecification',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.products.deleteSpecification(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete specification');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(hardDeleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;

