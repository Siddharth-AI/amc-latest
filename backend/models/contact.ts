/**
 * Contact Model
 * Database queries for contact forms
 */

import { supabaseAdmin } from '@/lib/supabase';
import type { ContactUs } from '@/types';

export class ContactModel {
  /**
   * Get all contact forms (admin only)
   */
  static async findAll(): Promise<ContactUs[]> {
    const { data, error } = await supabaseAdmin!
      .from('contact_us')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch contact forms: ${error.message}`);
    }

    return (data || []) as ContactUs[];
  }

  /**
   * Get all contact forms with pagination (admin)
   */
  static async findAllPaginated(page: number = 1, limit: number = 10): Promise<{
    data: ContactUs[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const offset = (page - 1) * limit;

    // Get total count
    const { count, error: countError } = await supabaseAdmin!
      .from('contact_us')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_deleted', false);

    if (countError) {
      throw new Error(`Failed to count contact forms: ${countError.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const { data, error } = await supabaseAdmin!
      .from('contact_us')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch contact forms: ${error.message}`);
    }

    return {
      data: (data || []) as ContactUs[],
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get contact by ID
   */
  static async findById(id: string): Promise<ContactUs | null> {
    const { data, error } = await supabaseAdmin!
      .from('contact_us')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (error || !data) {
      return null;
    }

    return data as ContactUs;
  }

  /**
   * Create contact form
   */
  static async create(contactData: {
    full_name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<ContactUs> {
    const { data, error } = await supabaseAdmin!
      .from('contact_us')
      .insert(contactData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create contact form: ${error.message}`);
    }

    return data as ContactUs;
  }
}

