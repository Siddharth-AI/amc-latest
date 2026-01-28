/**
 * Enquiry Slice
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

export interface Enquiry {
  id: string;
  category_id: string | null;
  product_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  company_name: string | null;
  message: string;
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

interface EnquiryState {
  enquiries: Enquiry[];
  currentEnquiry: Enquiry | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
}

const initialState: EnquiryState = {
  enquiries: [],
  currentEnquiry: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchEnquiries = createAsyncThunk(
  'enquiry/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.enquiries.getAll({ page, limit });
      // API returns { success, message, data: { data: [], meta: {} } }
      return response.data.data as PaginatedResponse<Enquiry>;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enquiries');
    }
  }
);

export const fetchEnquiryById = createAsyncThunk(
  'enquiry/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.enquiries.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enquiry');
    }
  }
);

const enquirySlice = createSlice({
  name: 'enquiry',
  initialState,
  reducers: {
    clearCurrentEnquiry: (state) => {
      state.currentEnquiry = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnquiries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEnquiries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enquiries = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchEnquiries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEnquiryById.fulfilled, (state, action) => {
        state.currentEnquiry = action.payload;
      });
  },
});

export const { clearCurrentEnquiry, clearError } = enquirySlice.actions;
export default enquirySlice.reducer;

