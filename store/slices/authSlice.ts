/**
 * Auth Slice
 * Manages authentication state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Load auth from localStorage on init
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('admin_access_token');
  const storedRefreshToken = localStorage.getItem('admin_refresh_token');
  const storedUser = localStorage.getItem('admin_user');

  if (storedToken && storedUser) {
    initialState.accessToken = storedToken;
    initialState.refreshToken = storedRefreshToken || null;
    initialState.user = JSON.parse(storedUser);
    initialState.isAuthenticated = true;
  }
}

// Login async thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.auth.login(credentials);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    }
  }
);

// Refresh token async thunk
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshTokenValue = state.auth.refreshToken;

      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await api.auth.refresh({ refreshToken: refreshTokenValue });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_refresh_token');
        localStorage.removeItem('admin_user');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;

        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_access_token', action.payload.accessToken);
          localStorage.setItem('admin_refresh_token', action.payload.refreshToken);
          localStorage.setItem('admin_user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Refresh token
    builder
      .addCase(refreshToken.pending, (state) => {
        // Don't set loading to true to avoid UI flicker during auto-refresh
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        // Keep user authenticated
        state.isAuthenticated = true;

        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_access_token', action.payload.accessToken);
          localStorage.setItem('admin_refresh_token', action.payload.refreshToken);
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        // If refresh fails, logout
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;

        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_refresh_token');
          localStorage.removeItem('admin_user');
          // Redirect to login only if we're in admin area
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          }
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

