/**
 * Products List Page
 */

'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts, deleteProduct, toggleProductStatus, hardDeleteProduct, Product } from '@/store/slices/productSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { Plus, Edit, Trash2, Package, Eye } from 'lucide-react';
import { Pagination } from '@/components/admin/Pagination';
import { ViewModal } from '@/components/admin/ViewModal';
import Image from 'next/image';
import { getProductImageUrl } from '@/utils/image';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, isLoading, pagination } = useAppSelector((state) => state.product);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hardDeletingId, setHardDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeletingId(id);
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted successfully');
      dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage }));
    } catch (error: any) {
      toast.error(error || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleHardDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this product? This action cannot be undone and will delete all images from Cloudinary.')) {
      return;
    }

    setHardDeletingId(id);
    try {
      await dispatch(hardDeleteProduct(id)).unwrap();
      toast.success('Product permanently deleted successfully');
      dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage }));
    } catch (error: any) {
      toast.error(error || 'Failed to delete product');
    } finally {
      setHardDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await dispatch(toggleProductStatus({ id, isActive: !currentStatus })).unwrap();
      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage }));
    } catch (error: any) {
      toast.error(error || 'Failed to toggle product status');
    } finally {
      setTogglingId(null);
    }
  };

  const productsList = Array.isArray(products) ? products : [];

  if (isLoading && productsList.length === 0) {
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
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-navy-900 mb-1 sm:mb-2">Products</h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">Manage your products</p>
          </div>
          <Link href="/admin/products/create" className="flex-shrink-0">
            <Button className="bg-primary-500 hover:bg-primary-600 text-white w-full sm:w-auto text-sm sm:text-base">
              <Plus size={16} className="sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Create New Product</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>

        {productsList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-12 text-center border border-gray-200">
            <Package size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-navy-900 mb-2">No products yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Get started by creating your first product</p>
            <Link href="/admin/products/create">
              <Button className="bg-primary-500 hover:bg-primary-600 text-white text-sm sm:text-base">
                <Plus size={18} className="sm:w-5 sm:h-5 mr-2" />
                Create Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-gray-200">
              {productsList.map((product) => (
                <div key={product.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-navy-900 truncate">{product.name}</h3>
                      {product.title && (
                        <p className="text-xs text-gray-600 truncate mt-1">{product.title}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleStatus(product.id, product.is_active)}
                      disabled={togglingId === product.id || product.is_deleted}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${
                        product.is_active && !product.is_deleted
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      } ${togglingId === product.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          product.is_active && !product.is_deleted ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 mb-3">
                    Warranty: {product.is_warranty ? product.warranty_period || 'Yes' : 'No'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 text-gray-600 hover:text-gray-700 text-xs"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    <Link href={`/admin/products/${product.id}`} className="flex-1">
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
                      onClick={() => handleHardDelete(product.id)}
                      disabled={hardDeletingId === product.id}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                    >
                      {hardDeletingId === product.id ? (
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
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Slug
                    </th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Title
                    </th>
                    <th className="px-3 lg:px-6 py-2 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Warranty
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
                  {productsList.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-navy-900">{product.name}</div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-xs sm:text-sm text-gray-600 font-mono">{product.slug}</div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-xs sm:text-sm text-gray-600">{product.title || '-'}</div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-600">
                          {product.is_warranty ? product.warranty_period || 'Yes' : 'No'}
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(product.id, product.is_active)}
                          disabled={togglingId === product.id || product.is_deleted}
                          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                            product.is_active && !product.is_deleted
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          } ${togglingId === product.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                              product.is_active && !product.is_deleted ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        {togglingId === product.id && (
                          <span className="ml-2 text-xs text-gray-500 hidden sm:inline">Updating...</span>
                        )}
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProduct(product)}
                            className="text-gray-600 hover:text-gray-700 p-1.5 sm:p-2"
                          >
                            <Eye size={14} className="sm:w-4 sm:h-4" />
                          </Button>
                          <Link href={`/admin/products/${product.id}`}>
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
                            onClick={() => handleHardDelete(product.id)}
                            disabled={hardDeletingId === product.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2"
                            title="Permanently delete product"
                          >
                            {hardDeletingId === product.id ? (
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
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title="Product Details"
        >
          {selectedProduct && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* Images */}
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Images ({selectedProduct.images.length})</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProduct.images.map((img, idx) => (
                      <div key={idx} className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={getProductImageUrl(img.base_url, img.img_name) || '/placeholder.png'}
                          alt={`${selectedProduct.name} ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Images</label>
                  <p className="text-sm text-gray-500">No images available</p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <p className="text-sm text-gray-900 mt-1">{selectedProduct.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Slug</label>
                  <p className="text-sm text-gray-900 mt-1 font-mono">{selectedProduct.slug}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedProduct.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              </div>

              {selectedProduct.title && (
                <div>
                  <label className="text-sm font-semibold text-gray-700">Title</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedProduct.title}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-700">Warranty</label>
                <p className="text-sm text-gray-900 mt-1">
                  {selectedProduct.is_warranty ? selectedProduct.warranty_period || 'Yes' : 'No'}
                </p>
              </div>

              {selectedProduct.description && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
                  <div 
                    className="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200"
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      lineHeight: '1.6'
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: selectedProduct.description
                        .replace(/<\/p>/g, '</p><br/>')
                        .replace(/<pre>/g, '<pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0;">')
                        .replace(/<code>/g, '<code style="background: #e5e7eb; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">')
                        .replace(/<blockquote>/g, '<blockquote style="border-left: 4px solid #d1d5db; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #6b7280;">')
                        .replace(/<hr>/g, '<hr style="margin: 1.5rem 0; border-color: #d1d5db;"/>')
                    }} 
                  />
                </div>
              )}

              {/* Specifications */}
              {selectedProduct.specifications && selectedProduct.specifications.length > 0 ? (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Specifications ({selectedProduct.specifications.length})</label>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {selectedProduct.specifications.map((spec, idx) => (
                      <div key={idx} className="flex justify-between items-start border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                        <span className="text-sm font-medium text-gray-700">{spec.key}:</span>
                        <span className="text-sm text-gray-900 text-right ml-2">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Specifications</label>
                  <p className="text-sm text-gray-500">No specifications available</p>
                </div>
              )}

              {/* Features */}
              {selectedProduct.features && selectedProduct.features.length > 0 ? (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Features ({selectedProduct.features.length})</label>
                  <ul className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                    {selectedProduct.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-900 flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>{feature.feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Features</label>
                  <p className="text-sm text-gray-500">No features available</p>
                </div>
              )}
            </div>
          )}
        </ViewModal>
      </div>
    </ProtectedRoute>
  );
}

