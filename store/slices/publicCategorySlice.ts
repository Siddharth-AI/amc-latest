/**
 * Public Category Slice
 * State management for public categories (no auth required)
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { Category, Product } from '@/types';

interface PublicCategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  categoryProducts: Product[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  productsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: PublicCategoryState = {
  categories: [],
  selectedCategory: null,
  categoryProducts: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  productsPagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

// Async Thunks
export const fetchPublicCategories = createAsyncThunk(
  'publicCategory/fetchAll',
  async (params: { page?: number; limit?: number } = {}) => {
    const response = await api.public.categories.getAll(params);
    return response.data.data;
  }
);

export const fetchPublicCategoryBySlug = createAsyncThunk(
  'publicCategory/fetchBySlug',
  async (slug: string) => {
    const response = await api.public.categories.getBySlug(slug);
    return response.data.data;
  }
);

export const fetchCategoryProducts = createAsyncThunk(
  'publicCategory/fetchProducts',
  async (params: { slug: string; page?: number; limit?: number; search?: string; sort_by?: 'name' | 'created_at' }) => {
    const { slug, ...queryParams } = params;
    const response = await api.public.categories.getProducts(slug, queryParams);
    return response.data.data;
  }
);

// Slice
const publicCategorySlice = createSlice({
  name: 'publicCategory',
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
      state.categoryProducts = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all categories
    builder
      .addCase(fetchPublicCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data || action.payload;
        if (action.payload.meta) {
          state.pagination = action.payload.meta;
        }
      })
      .addCase(fetchPublicCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });

    // Fetch category by slug
    builder
      .addCase(fetchPublicCategoryBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicCategoryBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchPublicCategoryBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch category';
      });

    // Fetch category products
    builder
      .addCase(fetchCategoryProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryProducts = action.payload.data || action.payload;
        if (action.payload.meta) {
          state.productsPagination = action.payload.meta;
        }
      })
      .addCase(fetchCategoryProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { clearSelectedCategory, clearError } = publicCategorySlice.actions;
export default publicCategorySlice.reducer;
