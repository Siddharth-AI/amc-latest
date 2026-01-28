/**
 * Public Product Slice
 * State management for public products (no auth required)
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { Product, ProductWithDetails } from '@/types';

interface PublicProductState {
  products: Product[];
  selectedProduct: ProductWithDetails | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    category_id: string | null;
    search: string;
    sort_by: 'name' | 'created_at';
  };
}

const initialState: PublicProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  filters: {
    category_id: null,
    search: '',
    sort_by: 'created_at',
  },
};

// Async Thunks
export const fetchPublicProducts = createAsyncThunk(
  'publicProduct/fetchAll',
  async (params: { page?: number; limit?: number; category_id?: string; search?: string; sort_by?: 'name' | 'created_at' } = {}) => {
    const response = await api.public.products.getAll(params);
    return response.data.data;
  }
);

export const fetchPublicProductBySlug = createAsyncThunk(
  'publicProduct/fetchBySlug',
  async (slug: string) => {
    const response = await api.public.products.getBySlug(slug);
    return response.data.data;
  }
);

// Slice
const publicProductSlice = createSlice({
  name: 'publicProduct',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all products
    builder
      .addCase(fetchPublicProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || action.payload;
        if (action.payload.meta) {
          state.pagination = action.payload.meta;
        }
      })
      .addCase(fetchPublicProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });

    // Fetch product by slug
    builder
      .addCase(fetchPublicProductBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicProductBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchPublicProductBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch product';
      });
  },
});

export const { setFilters, clearFilters, clearSelectedProduct, clearError } = publicProductSlice.actions;
export default publicProductSlice.reducer;
