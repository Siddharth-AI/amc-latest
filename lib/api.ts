/**
 * Central API Client
 * Axios instance with authentication and error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage or Redux store
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 (unauthorized) with automatic refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('admin_refresh_token');

        if (refreshToken) {
          try {
            // Call refresh token API
            const refreshResponse = await axios.post(
              `${API_BASE_URL}/auth/refresh`,
              { refreshToken },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

            // Update tokens in localStorage
            localStorage.setItem('admin_access_token', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('admin_refresh_token', newRefreshToken);
            }

            // Update authorization header and retry original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh failed - logout user
            localStorage.removeItem('admin_access_token');
            localStorage.removeItem('admin_refresh_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/admin/login';
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token - logout
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_refresh_token');
          localStorage.removeItem('admin_user');
          window.location.href = '/admin/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Auth
  auth: {
    login: (data: { email: string; password: string }) =>
      apiClient.post('/auth/login', data),
    refresh: (data: { refreshToken: string }) =>
      apiClient.post('/auth/refresh', data),
  },

  // Categories
  categories: {
    getAll: (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      const query = queryParams.toString();
      return apiClient.get(`/admin/categories${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => apiClient.get(`/admin/categories/${id}`),
    create: (formData: FormData) =>
      apiClient.post('/admin/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    update: (id: string, formData: FormData) =>
      apiClient.put(`/admin/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    delete: (id: string) => apiClient.delete(`/admin/categories/${id}`),
    toggleStatus: (id: string, isActive: boolean) =>
      apiClient.patch(`/admin/categories/${id}/toggle-status`, { isActive }),
    hardDelete: (id: string) => apiClient.delete(`/admin/categories/${id}/hard-delete`),
  },

  // Products
  products: {
    getAll: (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      const query = queryParams.toString();
      return apiClient.get(`/admin/products${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => apiClient.get(`/admin/products/${id}`),
    create: (data: any) => apiClient.post('/admin/products', data),
    update: (id: string, data: any) => apiClient.put(`/admin/products/${id}`, data),
    delete: (id: string) => apiClient.delete(`/admin/products/${id}`),
    toggleStatus: (id: string, isActive: boolean) =>
      apiClient.patch(`/admin/products/${id}/toggle-status`, { isActive }),
    hardDelete: (id: string) => apiClient.delete(`/admin/products/${id}/hard-delete`),
    uploadImages: (id: string, formData: FormData) =>
      apiClient.post(`/admin/products/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    deleteImage: (id: string) => apiClient.delete(`/admin/products/images/${id}`),
    createKeyFeature: (productId: string, data: { name: string }) =>
      apiClient.post(`/admin/products/${productId}/key-features`, data),
    updateKeyFeature: (id: string, data: { name?: string; is_active?: boolean }) =>
      apiClient.put(`/admin/products/key-features/${id}`, data),
    deleteKeyFeature: (id: string) => apiClient.delete(`/admin/products/key-features/${id}`),
    createSpecification: (productId: string, data: { specification_key: string; specification_value: string }) =>
      apiClient.post(`/admin/products/${productId}/specifications`, data),
    updateSpecification: (id: string, data: { specification_key?: string; specification_value?: string; is_active?: boolean }) =>
      apiClient.put(`/admin/products/specifications/${id}`, data),
    deleteSpecification: (id: string) => apiClient.delete(`/admin/products/specifications/${id}`),
  },

  // Blogs
  blogs: {
    getAll: (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      const query = queryParams.toString();
      return apiClient.get(`/admin/blogs${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => apiClient.get(`/admin/blogs/${id}`),
    create: (formData: FormData) =>
      apiClient.post('/admin/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    update: (id: string, formData: FormData) =>
      apiClient.put(`/admin/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    delete: (id: string) => apiClient.delete(`/admin/blogs/${id}`),
    toggleStatus: (id: string, isActive: boolean) =>
      apiClient.patch(`/admin/blogs/${id}/toggle-status`, { isActive }),
    hardDelete: (id: string) => apiClient.delete(`/admin/blogs/${id}/hard-delete`),
    createTag: (blogId: string, data: { name: string }) =>
      apiClient.post(`/admin/blogs/${blogId}/tags`, data),
    updateTag: (id: string, data: { name: string }) =>
      apiClient.put(`/admin/blogs/tags/${id}`, data),
    deleteTag: (id: string) => apiClient.delete(`/admin/blogs/tags/${id}`),
  },

  // Enquiries
  enquiries: {
    getAll: (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      const query = queryParams.toString();
      return apiClient.get(`/admin/enquiries${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => apiClient.get(`/admin/enquiries/${id}`),
  },

  // Contacts
  contacts: {
    getAll: (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      const query = queryParams.toString();
      return apiClient.get(`/admin/contacts${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => apiClient.get(`/admin/contacts/${id}`),
  },

  // Public APIs (no auth required)
  public: {
    categories: {
      getAll: (params?: { page?: number; limit?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        const query = queryParams.toString();
        return axios.get(`${API_BASE_URL}/public/categories${query ? `?${query}` : ''}`);
      },
      getBySlug: (slug: string) =>
        axios.get(`${API_BASE_URL}/public/categories/by-slug/${slug}`),
      getProducts: (slug: string, params?: { page?: number; limit?: number; search?: string; sort_by?: 'name' | 'created_at' }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
        const query = queryParams.toString();
        return axios.get(`${API_BASE_URL}/public/categories/by-slug/${slug}/products${query ? `?${query}` : ''}`);
      },
    },
    products: {
      getAll: (params?: { page?: number; limit?: number; category_id?: string; search?: string; sort_by?: 'name' | 'created_at' }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.category_id) queryParams.append('category_id', params.category_id);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
        const query = queryParams.toString();
        return axios.get(`${API_BASE_URL}/public/products${query ? `?${query}` : ''}`);
      },
      getBySlug: (slug: string) =>
        axios.get(`${API_BASE_URL}/public/products/by-slug/${slug}`),
    },
    blogs: {
      getAll: (params?: { page?: number; limit?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        const query = queryParams.toString();
        return axios.get(`${API_BASE_URL}/public/blogs${query ? `?${query}` : ''}`);
      },
      getBySlug: (slug: string) =>
        axios.get(`${API_BASE_URL}/public/blogs/by-slug/${slug}`),
    },
    enquiry: {
      create: (data: {
        full_name: string;
        email: string;
        phone: string;
        company_name?: string;
        message: string;
        category_id?: string;
        product_id?: string;
      }) => axios.post(`${API_BASE_URL}/public/enquiry`, data),
    },
    contact: {
      create: (data: {
        full_name: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
      }) => axios.post(`${API_BASE_URL}/public/contact`, data),
    },
  },
};

