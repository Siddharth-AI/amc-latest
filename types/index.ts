/**
 * TypeScript Types
 * All database and API types
 */

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  img_original_name: string | null;
  base_url: string | null;
  img_name: string | null;
  img_type: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  title: string | null;
  description: string | null;
  is_warranty: boolean;
  warranty_period: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  original_name: string;
  base_url: string;
  name: string;
  type: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
}

export interface ProductKeyFeature {
  id: string;
  product_id: string;
  name: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
}

export interface ProductSpecification {
  id: string;
  product_id: string;
  specification_key: string;
  specification_value: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  description: string; // HTML content
  img_original_name: string | null;
  base_url: string | null;
  img_name: string | null;
  img_type: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
}

export interface BlogTag {
  id: string;
  blog_id: string;
  name: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
}

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
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
}

export interface ContactUs {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
}

// Extended types with relations
export interface ProductWithDetails extends Product {
  category?: Category;
  images?: ProductImage[];
  key_features?: ProductKeyFeature[];
  specifications?: ProductSpecification[];
}

export interface BlogWithTags extends Blog {
  tags?: BlogTag[];
}

