/**
 * Contact Slice
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

export interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
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

interface ContactState {
  contacts: Contact[];
  currentContact: Contact | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
}

const initialState: ContactState = {
  contacts: [],
  currentContact: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const fetchContacts = createAsyncThunk(
  'contact/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.contacts.getAll({ page, limit });
      // API returns { success, message, data: { data: [], meta: {} } }
      return response.data.data as PaginatedResponse<Contact>;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts');
    }
  }
);

export const fetchContactById = createAsyncThunk(
  'contact/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.contacts.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact');
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    clearCurrentContact: (state) => {
      state.currentContact = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.currentContact = action.payload;
      });
  },
});

export const { clearCurrentContact, clearError } = contactSlice.actions;
export default contactSlice.reducer;

