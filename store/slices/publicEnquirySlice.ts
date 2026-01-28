/**
 * Public Enquiry Slice
 * State management for enquiry form submission
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

interface PublicEnquiryState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: PublicEnquiryState = {
  loading: false,
  success: false,
  error: null,
};

export const submitEnquiry = createAsyncThunk(
  'publicEnquiry/submit',
  async (data: {
    full_name: string;
    email: string;
    phone: string;
    company_name?: string;
    message: string;
    category_id?: string;
    product_id?: string;
  }) => {
    const response = await api.public.enquiry.create(data);
    return response.data;
  }
);

const publicEnquirySlice = createSlice({
  name: 'publicEnquiry',
  initialState,
  reducers: {
    resetEnquiryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEnquiry.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitEnquiry.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(submitEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message || 'Failed to submit enquiry';
      });
  },
});

export const { resetEnquiryState } = publicEnquirySlice.actions;
export default publicEnquirySlice.reducer;
