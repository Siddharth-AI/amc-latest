/**
 * Contact Service
 * Business logic for contact forms
 */

import { ContactModel } from '@/backend/models/contact';
import type { CreateContactInput } from '@/validators/contact';
import type { ContactUs } from '@/types';

export class ContactService {
  /**
   * Create contact form (public)
   */
  static async createContact(input: CreateContactInput): Promise<ContactUs> {
    return ContactModel.create({
      full_name: input.full_name,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
    });
  }

  /**
   * Get all contact forms (admin)
   */
  static async getAllContacts(): Promise<ContactUs[]> {
    return ContactModel.findAll();
  }

  /**
   * Get all contact forms with pagination (admin)
   */
  static async getAllContactsPaginated(page: number = 1, limit: number = 10): Promise<{
    data: ContactUs[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    return ContactModel.findAllPaginated(page, limit);
  }

  /**
   * Get contact by ID (admin)
   */
  static async getContactById(id: string): Promise<ContactUs | null> {
    return ContactModel.findById(id);
  }
}

