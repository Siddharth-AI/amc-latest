/**
 * Public Blog Slice
 * State management for public blog listing and detail pages
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { BlogWithTags } from '@/types';

interface PublicBlogState {
  blogs: BlogWithTags[];
  selectedBlog: BlogWithTags | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: PublicBlogState = {
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchPublicBlogs = createAsyncThunk(
  'publicBlog/fetchPublicBlogs',
  async (params: { page?: number; limit?: number } = {}) => {
    const response = await api.public.blogs.getAll(params);
    return response.data.data;
  }
);

export const fetchPublicBlogBySlug = createAsyncThunk(
  'publicBlog/fetchPublicBlogBySlug',
  async (slug: string) => {
    const response = await api.public.blogs.getBySlug(slug);
    return response.data.data;
  }
);

const publicBlogSlice = createSlice({
  name: 'publicBlog',
  initialState,
  reducers: {
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch public blogs
    builder
      .addCase(fetchPublicBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicBlogs.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.blogs = action.payload.data || [];
        state.pagination = {
          page: action.payload.meta?.page || 1,
          limit: action.payload.meta?.limit || 12,
          total: action.payload.meta?.total || 0,
          totalPages: action.payload.meta?.totalPages || 0,
        };
      })
      .addCase(fetchPublicBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blogs';
      });

    // Fetch blog by slug
    builder
      .addCase(fetchPublicBlogBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicBlogBySlug.fulfilled, (state, action: PayloadAction<BlogWithTags>) => {
        state.loading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchPublicBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blog';
      });
  },
});

export const { clearSelectedBlog, clearError } = publicBlogSlice.actions;
export default publicBlogSlice.reducer;
