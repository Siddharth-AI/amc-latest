/**
 * Enquiry Model
 * Database queries for enquiries
 */

import { supabaseAdmin } from '@/lib/supabase';
import type { Enquiry } from '@/types';

export class EnquiryModel {
  /**
   * Get all enquiries (admin only)
   */
  static async findAll(): Promise<Enquiry[]> {
    const { data, error } = await supabaseAdmin!
      .from('enquiry')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch enquiries: ${error.message}`);
    }

    return (data || []) as Enquiry[];
  }

  /**
   * Get all enquiries with pagination (admin)
   */
  static async findAllPaginated(page: number = 1, limit: number = 10): Promise<{
    data: Enquiry[];
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
      .from('enquiry')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_deleted', false);

    if (countError) {
      throw new Error(`Failed to count enquiries: ${countError.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const { data, error } = await supabaseAdmin!
      .from('enquiry')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch enquiries: ${error.message}`);
    }

    return {
      data: (data || []) as Enquiry[],
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get enquiry by ID
   */
  static async findById(id: string): Promise<Enquiry | null> {
    const { data, error } = await supabaseAdmin!
      .from('enquiry')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Enquiry;
  }

  /**
   * Create enquiry
   */
  static async create(enquiryData: {
    category_id?: string;
    product_id?: string;
    full_name: string;
    email: string;
    phone: string;
    company_name?: string;
    message: string;
  }): Promise<Enquiry> {
    const { data, error } = await supabaseAdmin!
      .from('enquiry')
      .insert(enquiryData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create enquiry: ${error.message}`);
    }

    return data as Enquiry;
  }
}

