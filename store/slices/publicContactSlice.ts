/**
 * Public Contact Slice
 * State management for contact form submission
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

interface PublicContactState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: PublicContactState = {
  loading: false,
  success: false,
  error: null,
};

export const submitContact = createAsyncThunk(
  'publicContact/submit',
  async (data: {
    full_name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => {
    const response = await api.public.contact.create(data);
    return response.data;
  }
);

const publicContactSlice = createSlice({
  name: 'publicContact',
  initialState,
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContact.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitContact.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message || 'Failed to submit contact';
      });
  },
});

export const { resetContactState } = publicContactSlice.actions;
export default publicContactSlice.reducer;
