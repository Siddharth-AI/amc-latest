/**
 * Blogs List Page
 */

'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBlogs, toggleBlogStatus, deleteBlog } from '@/store/slices/blogSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { Plus, Edit, Trash2, Image as ImageIcon, FileText, Eye } from 'lucide-react';
import Image from 'next/image';
import { getBlogImageUrl } from '@/utils/image';
import { Pagination } from '@/components/admin/Pagination';
import { ViewModal } from '@/components/admin/ViewModal';
import { Blog } from '@/types';

export default function BlogsPage() {
  const dispatch = useAppDispatch();
  const { blogs, isLoading, pagination } = useAppSelector((state) => state.blog);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    dispatch(fetchBlogs({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSoftDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog? This will deactivate the blog.')) {
      return;
    }

    setDeletingId(id);
    try {
      await dispatch(deleteBlog(id)).unwrap();
      toast.success('Blog deleted successfully');
      dispatch(fetchBlogs({ page: currentPage, limit: itemsPerPage }));
    } catch (error: any) {
      toast.error(error || 'Failed to delete blog');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await dispatch(toggleBlogStatus({ id, isActive: !currentStatus })).unwrap();
      toast.success(`Blog ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      dispatch(fetchBlogs({ page: currentPage, limit: itemsPerPage }));
    } catch (error: any) {
      toast.error(error || 'Failed to toggle blog status');
    } finally {
      setTogglingId(null);
    }
  };

  if (isLoading && blogs.length === 0) {
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
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-navy-900 mb-1 sm:mb-2">Blogs</h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">Manage your blog posts</p>
          </div>
          <Link href="/admin/blogs/create" className="flex-shrink-0">
            <Button className="bg-primary-500 hover:bg-primary-600 text-white w-full sm:w-auto text-sm sm:text-base">
              <Plus size={16} className="sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Create New Blog</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-12 text-center border border-gray-200">
            <FileText size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-navy-900 mb-2">No blogs yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Get started by creating your first blog post</p>
            <Link href="/admin/blogs/create">
              <Button className="bg-primary-500 hover:bg-primary-600 text-white text-sm sm:text-base">
                <Plus size={18} className="sm:w-5 sm:h-5 mr-2" />
                Create Blog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-gray-200">
              {blogs.map((blog) => (
                <div key={blog.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {blog.img_name ? (
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={getBlogImageUrl(blog.base_url, blog.img_name) || '/placeholder.png'}
                          alt={blog.title}
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
                        <h3 className="text-sm font-semibold text-navy-900 line-clamp-2 flex-1">{blog.title}</h3>
                        <button
                          onClick={() => handleToggleStatus(blog.id, blog.is_active)}
                          disabled={togglingId === blog.id || blog.is_deleted}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${
                            blog.is_active && !blog.is_deleted
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          } ${togglingId === blog.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              blog.is_active && !blog.is_deleted ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBlog(blog as any)}
                          className="flex-1 text-gray-600 hover:text-gray-700 text-xs"
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        <Link href={`/admin/blogs/${blog.id}`} className="flex-1">
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
                          onClick={() => handleSoftDelete(blog.id)}
                          disabled={deletingId === blog.id}
                          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        >
                          {deletingId === blog.id ? (
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
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        {blog.img_name ? (
                          <div className="w-12 h-12 lg:w-16 lg:h-16 relative rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={getBlogImageUrl(blog.base_url, blog.img_name) || '/placeholder.png'}
                              alt={blog.title}
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
                      <td className="px-3 lg:px-6 py-3 lg:py-4">
                        <div className="text-xs sm:text-sm font-medium text-navy-900 line-clamp-2">{blog.title}</div>
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(blog.id, blog.is_active)}
                          disabled={togglingId === blog.id || blog.is_deleted}
                          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                            blog.is_active && !blog.is_deleted
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          } ${togglingId === blog.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                              blog.is_active && !blog.is_deleted ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        {togglingId === blog.id && (
                          <span className="ml-2 text-xs text-gray-500 hidden sm:inline">Updating...</span>
                        )}
                      </td>
                      <td className="px-3 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBlog(blog as any)}
                            className="text-gray-600 hover:text-gray-700 p-1.5 sm:p-2"
                          >
                            <Eye size={14} className="sm:w-4 sm:h-4" />
                          </Button>
                          <Link href={`/admin/blogs/${blog.id}`}>
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
                            onClick={() => handleSoftDelete(blog.id)}
                            disabled={deletingId === blog.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 sm:p-2"
                            title="Delete blog"
                          >
                            {deletingId === blog.id ? (
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
          isOpen={!!selectedBlog}
          onClose={() => setSelectedBlog(null)}
          title="Blog Details"
        >
          {selectedBlog && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {selectedBlog.img_name && (
                <div className="w-full h-48 relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={getBlogImageUrl(selectedBlog.base_url, selectedBlog.img_name) || '/placeholder.png'}
                    alt={selectedBlog.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-700">Title</label>
                <p className="text-sm text-gray-900 mt-1">{selectedBlog.title}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Slug</label>
                <p className="text-sm text-gray-900 mt-1 font-mono">{selectedBlog.slug}</p>
              </div>
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
                    __html: selectedBlog.description
                      .replace(/<\/p>/g, '</p><br/>')
                      .replace(/<pre>/g, '<pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0;">')
                      .replace(/<code>/g, '<code style="background: #e5e7eb; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">')
                      .replace(/<blockquote>/g, '<blockquote style="border-left: 4px solid #d1d5db; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #6b7280;">')
                      .replace(/<hr>/g, '<hr style="margin: 1.5rem 0; border-color: #d1d5db;"/>')
                  }} 
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <p className="text-sm text-gray-900 mt-1">{selectedBlog.is_active ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          )}
        </ViewModal>
      </div>
    </ProtectedRoute>
  );
}

