/**
 * Categories List Page
 */

'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategories, toggleCategoryStatus, deleteCategory, Category } from '@/store/slices/categorySlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { Plus, Edit, Trash2, Image as ImageIcon, FolderTree, Eye } from 'lucide-react';
import Image from 'next/image';
import { getCategoryImageUrl } from '@/utils/image';
import { Pagination } from '@/components/admin/Pagination';
import { ViewModal } from '@/components/admin/ViewModal';


export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, isLoading, pagination } = useAppSelector((state) => state.category);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    dispatch(fetchCategories({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSoftDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will deactivate the category and all related products.')) {
      return;
    }

    setDeletingId(id);
    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success('Category deleted successfully');
      dispatch(fetchCategories({ page: currentPage, limit: itemsPerPage }));
    } catch (error: any) {
      toast.error(error || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await dispatch(toggleCategoryStatus({ id, isActive: !currentStatus })).unwrap();
      toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      dispatch(fetchCategories({ page: currentPage, limit: itemsPerPage }));
    } catch (error: any) {
      toast.error(error || 'Failed to toggle category status');
    } finally {
      setTogglingId(null);
    }
  };

  const categoriesList = Array.isArray(categories) ? categories : [];

  if (isLoading && categoriesList.length === 0) {
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-navy-900 mb-1 sm:mb-2">Categories</h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">Manage your product categories</p>
          </div>
          <Link href="/admin/categories/create" className="flex-shrink-0">
            <Button className="bg-primary-500 hover:bg-primary-600 text-white w-full sm:w-auto text-sm sm:text-base">
              <Plus size={16} className="sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Create New Category</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>

        {categoriesList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-12 text-center border border-gray-200">
            <FolderTree size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-navy-900 mb-2">No categories yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Get started by creating your first category</p>
            <Link href="/admin/categories/create">
              <Button className="bg-primary-500 hover:bg-primary-600 text-white text-sm sm:text-base">
                <Plus size={18} className="sm:w-5 sm:h-5 mr-2" />
                Create Category
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-gray-200">
              {categoriesList.map((category) => (
                <div key={category.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {category.img_name ? (
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={getCategoryImageUrl(category.base_url, category.img_name) || '/placeholder.png'}
                          alt={category.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ImageIcon size={24} className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-navy-900 truncate">{category.name}</h3>
                          {category.title && (
                            <p className="text-xs text-gray-600 truncate mt-1">{category.title}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleToggleStatus(category.id, category.is_active)}
                          disabled={togglingId === category.id || category.is_deleted}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${
                            category.is_active && !category.is_deleted
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          } ${togglingId === category.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              category.is_active && !category.is_deleted ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className="flex-1 text-gray-600 hover:text-gray-700 text-xs"
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        <Link href={`/admin/categories/${category.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-primary-600 hover:text-primary-700 text-xs"
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSoftDelete(category.id)}
                          disabled={deletingId === category.id}
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        >
                          {deletingId === category.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-red-600"></div>
                          ) : (
                            <>
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
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
                      Image
                    </th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Slug
                    </th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Title
                    </th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categoriesList.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        {category.img_name ? (
                          <div className="w-12 h-12 lg:w-16 lg:h-16 relative rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={getCategoryImageUrl(category.base_url, category.img_name) || '/placeholder.png'}
                              alt={category.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                            <ImageIcon size={20} className="lg:w-6 lg:h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-navy-900">{category.name}</div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-xs sm:text-sm text-gray-600 font-mono">{category.slug}</div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-xs sm:text-sm text-gray-600">{category.title || '-'}</div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(category.id, category.is_active)}
                          disabled={togglingId === category.id || category.is_deleted}
                          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                            category.is_active && !category.is_deleted
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          } ${togglingId === category.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                              category.is_active && !category.is_deleted ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        {togglingId === category.id && (
                          <span className="ml-2 text-xs text-gray-500 hidden sm:inline">Updating...</span>
                        )}
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className="text-gray-600 hover:text-gray-700 p-1.5 sm:p-2"
                          >
                            <Eye size={14} className="sm:w-4 sm:h-4" />
                          </Button>
                          <Link href={`/admin/categories/${category.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-primary-600 hover:text-primary-700 p-1.5 sm:p-2"
                            >
                              <Edit size={14} className="sm:w-4 sm:h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSoftDelete(category.id)}
                            disabled={deletingId === category.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2"
                            title="Delete category"
                          >
                            {deletingId === category.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-t-2 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 size={14} className="sm:w-4 sm:h-4" />
                            )}
                          </Button>
                        </div>
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
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          title="Category Details"
        >
          {selectedCategory && (
            <div className="space-y-4">
              {selectedCategory.img_name && (
                <div className="w-full h-48 relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={getCategoryImageUrl(selectedCategory.base_url, selectedCategory.img_name) || '/placeholder.png'}
                    alt={selectedCategory.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <p className="text-sm text-gray-900 mt-1">{selectedCategory.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Slug</label>
                  <p className="text-sm text-gray-900 mt-1 font-mono">{selectedCategory.slug}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedCategory.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
              {selectedCategory.title && (
                <div>
                  <label className="text-sm font-semibold text-gray-700">Title</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedCategory.title}</p>
                </div>
              )}
              
            </div>
          )}
        </ViewModal>
      </div>
    </ProtectedRoute>
  );
}

