/**
 * Admin Model
 * Database queries for admin users
 */

import { supabaseAdmin } from '@/lib/supabase';
import type { AdminUser } from '@/types';

export class AdminModel {
  /**
   * Find admin by email
   */
  static async findByEmail(email: string): Promise<AdminUser | null> {
    const { data, error } = await supabaseAdmin!
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return data as AdminUser;
  }

  /**
   * Find admin by ID
   */
  static async findById(id: string): Promise<AdminUser | null> {
    const { data, error } = await supabaseAdmin!
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return data as AdminUser;
  }

  /**
   * Create admin user
   */
  static async create(adminData: {
    full_name: string;
    email: string;
    password: string;
    role?: 'admin' | 'super_admin';
  }): Promise<AdminUser> {
    const { data, error } = await supabaseAdmin!
      .from('admin_users')
      .insert({
        full_name: adminData.full_name,
        email: adminData.email,
        password: adminData.password,
        role: adminData.role || 'admin',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create admin: ${error.message}`);
    }

    return data as AdminUser;
  }
}

