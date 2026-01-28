/**
 * Enquiry Service
 * Business logic for enquiries
 */

import { EnquiryModel } from '@/backend/models/enquiry';
import type { CreateEnquiryInput } from '@/validators/enquiry';
import type { Enquiry } from '@/types';

export class EnquiryService {
  /**
   * Create enquiry (public)
   */
  static async createEnquiry(input: CreateEnquiryInput): Promise<Enquiry> {
    return EnquiryModel.create({
      category_id: input.category_id || undefined,
      product_id: input.product_id || undefined,
      full_name: input.full_name,
      email: input.email,
      phone: input.phone,
      company_name: input.company_name || undefined,
      message: input.message,
    });
  }

  /**
   * Get all enquiries (admin)
   */
  static async getAllEnquiries(): Promise<Enquiry[]> {
    return EnquiryModel.findAll();
  }

  /**
   * Get all enquiries with pagination (admin)
   */
  static async getAllEnquiriesPaginated(page: number = 1, limit: number = 10): Promise<{
    data: Enquiry[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return EnquiryModel.findAllPaginated(page, limit);
  }

  /**
   * Get enquiry by ID (admin)
   */
  static async getEnquiryById(id: string): Promise<Enquiry | null> {
    return EnquiryModel.findById(id);
  }
}

