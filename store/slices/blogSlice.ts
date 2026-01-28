/**
 * Blog Slice
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

export interface Blog {
  id: string;
  title: string;
  description: string;
  img_original_name: string | null;
  base_url: string | null;
  img_name: string | null;
  img_type: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
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

interface BlogState {
  blogs: Blog[];
  currentBlog: any | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
}

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchBlogs = createAsyncThunk(
  'blog/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.blogs.getAll({ page, limit });
      // API returns { success, message, data: { data: [], meta: {} } }
      return response.data.data as PaginatedResponse<Blog>;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  'blog/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.blogs.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch blog');
    }
  }
);

export const createBlog = createAsyncThunk(
  'blog/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.blogs.create(formData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create blog');
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blog/update',
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await api.blogs.update(id, formData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update blog');
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blog/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.blogs.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
    }
  }
);

// Toggle blog status
export const toggleBlogStatus = createAsyncThunk(
  'blog/toggleStatus',
  async ({ id, isActive }: { id: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      const response = await api.blogs.toggleStatus(id, isActive);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle blog status');
    }
  }
);

// Hard delete blog
export const hardDeleteBlog = createAsyncThunk(
  'blog/hardDelete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.blogs.hardDelete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete blog');
    }
  }
);

// Blog Tag Operations
export const addBlogTag = createAsyncThunk(
  'blog/addTag',
  async ({ blogId, data }: { blogId: string; data: { name: string } }, { rejectWithValue }) => {
    try {
      const response = await api.blogs.createTag(blogId, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add tag');
    }
  }
);

export const updateBlogTag = createAsyncThunk(
  'blog/updateTag',
  async ({ id, data }: { id: string; data: { name: string } }, { rejectWithValue }) => {
    try {
      const response = await api.blogs.updateTag(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tag');
    }
  }
);

export const deleteBlogTag = createAsyncThunk(
  'blog/deleteTag',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.blogs.deleteTag(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tag');
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.currentBlog = action.payload;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
      })
      .addCase(toggleBlogStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleBlogStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.blogs.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        if (state.currentBlog?.id === action.payload.id) {
          state.currentBlog = action.payload;
        }
      })
      .addCase(toggleBlogStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(hardDeleteBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hardDeleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
        if (state.currentBlog?.id === action.payload) {
          state.currentBlog = null;
        }
      })
      .addCase(hardDeleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentBlog, clearError } = blogSlice.actions;
export default blogSlice.reducer;

