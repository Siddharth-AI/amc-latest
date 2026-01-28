/**
 * Contacts List Page (Read-only)
 */

'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Contact, fetchContacts } from '@/store/slices/contactSlice';
import { Mail, Phone, MessageSquare, Eye } from 'lucide-react';
import { Pagination } from '@/components/admin/Pagination';
import { ViewModal } from '@/components/admin/ViewModal';

export default function ContactsPage() {
  const dispatch = useAppDispatch();
  const { contacts, isLoading, pagination } = useAppSelector((state) => state.contact);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    dispatch(fetchContacts({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && contacts.length === 0) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div>
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-navy-900 mb-1 sm:mb-2">Contacts</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">View all contact form submissions</p>
        </div>

        {contacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-12 text-center border border-gray-200">
            <Mail size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-navy-900 mb-2">No contacts yet</h3>
            <p className="text-sm sm:text-base text-gray-600">Contact form submissions will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-gray-200">
              {contacts.map((contact) => (
                <div key={contact.id} className="p-4">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-navy-900 mb-1">{contact.full_name}</h3>
                    <p className="text-xs font-medium text-gray-700 mb-2">{contact.subject}</p>
                    <div className="text-xs text-gray-600 space-y-1 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-gray-400" />
                        <span className="break-all">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-gray-400" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{contact.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Subject
                    </th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-navy-900">{contact.full_name}</div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4">
                        <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail size={12} className="text-gray-400 flex-shrink-0" />
                            <span className="break-all">{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={12} className="text-gray-400 flex-shrink-0" />
                            <span>{contact.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{contact.subject}</div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4">
                        <div className="text-xs sm:text-sm text-gray-600 max-w-md truncate">
                          {contact.message}
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-600">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="text-primary-600 hover:text-primary-700 font-medium text-xs sm:text-sm flex items-center gap-1"
                        >
                          <Eye size={16} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}

        <ViewModal
          isOpen={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          title="Contact Details"
        >
          {selectedContact && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <p className="text-sm text-gray-900 mt-1">{selectedContact.full_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedContact.phone}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Subject</label>
                <p className="text-sm text-gray-900 mt-1">{selectedContact.subject}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Submitted On</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(selectedContact.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </ViewModal>
      </div>
    </ProtectedRoute>
  );
}

