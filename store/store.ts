/**
 * Redux Store Configuration with Persist
 */

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import blogReducer from './slices/blogSlice';
import enquiryReducer from './slices/enquirySlice';
import contactReducer from './slices/contactSlice';
import publicCategoryReducer from './slices/publicCategorySlice';
import publicProductReducer from './slices/publicProductSlice';
import publicBlogReducer from './slices/publicBlogSlice';
import publicEnquiryReducer from './slices/publicEnquirySlice';
import publicContactReducer from './slices/publicContactSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['publicCategory', 'publicProduct', 'publicBlog'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  blog: blogReducer,
  enquiry: enquiryReducer,
  contact: contactReducer,
  publicCategory: publicCategoryReducer,
  publicProduct: publicProductReducer,
  publicBlog: publicBlogReducer,
  publicEnquiry: publicEnquiryReducer,
  publicContact: publicContactReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
