/**
 * Edit Blog Page
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { SlugInput } from '@/components/admin/SlugInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBlogById, updateBlog, addBlogTag, updateBlogTag, deleteBlogTag } from '@/store/slices/blogSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Plus, X, Edit2, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogImageUrl } from '@/utils/image';
import dynamic from 'next/dynamic';

// Dynamically import TipTap to avoid SSR issues
const TipTapEditor = dynamic(() => import('@/components/admin/TipTapEditor'), {
  ssr: false,
});

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { currentBlog, isLoading } = useAppSelector((state) => state.blog);
  const [slug, setSlug] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');

  // Tags state
  const [existingTags, setExistingTags] = useState<any[]>([]);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [newTag, setNewTag] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  const titleValue = watch('title', '');

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentBlog) {
      reset({
        title: currentBlog.title,
        description: currentBlog.description,
      });
      setSlug(currentBlog.slug || '');
      setDescription(currentBlog.description);
      setExistingTags(currentBlog.tags || []);
      if (currentBlog.base_url && currentBlog.img_name) {
        const imageUrl = getBlogImageUrl(currentBlog.base_url, currentBlog.img_name);
        if (imageUrl) {
          setImagePreview(imageUrl);
        }
      }
    }
  }, [currentBlog, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (content: string) => {
    setDescription(content);
    setValue('description', content, { shouldValidate: true });
  };

  // Start editing tag
  const startEditingTag = (tag: any) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
  };

  // Save tag edit
  const saveTagEdit = async (tagId: string) => {
    if (!editingTagName.trim()) {
      toast.error('Tag name is required');
      return;
    }
    try {
      await dispatch(updateBlogTag({ id: tagId, data: { name: editingTagName } })).unwrap();
      setExistingTags(existingTags.map(t => 
        t.id === tagId ? { ...t, name: editingTagName } : t
      ));
      setEditingTagId(null);
      toast.success('Tag updated');
    } catch (error: any) {
      toast.error(error || 'Failed to update tag');
    }
  };

  // Delete tag
  const handleDeleteTag = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    try {
      await dispatch(deleteBlogTag(tagId)).unwrap();
      setExistingTags(existingTags.filter(t => t.id !== tagId));
      toast.success('Tag deleted');
    } catch (error: any) {
      toast.error(error || 'Failed to delete tag');
    }
  };

  // Add new tag
  const handleAddTag = async () => {
    if (!newTag.trim()) {
      toast.error('Tag name is required');
      return;
    }
    try {
      const result = await dispatch(addBlogTag({ blogId: id, data: { name: newTag } })).unwrap();
      setExistingTags([...existingTags, result]);
      setNewTag('');
      toast.success('Tag added');
    } catch (error: any) {
      toast.error(error || 'Failed to add tag');
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', description || data.description);
      if (slug) {
        formData.append('slug', slug);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await dispatch(updateBlog({ id, formData })).unwrap();
      toast.success('Blog updated successfully!');
      router.push('/admin/blogs');
    } catch (error: any) {
      toast.error(error || 'Failed to update blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !currentBlog) {
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
        <div className="mb-6">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blogs
          </Link>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Edit Blog</h1>
          <p className="text-gray-600">Update blog post details</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
                placeholder="Blog title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <SlugInput
              value={slug}
              onChange={setSlug}
              autoGenerateFrom={titleValue}
              urlPrefix="/news/"
              table="blog"
              excludeId={id}
            />

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <TipTapEditor
                content={description}
                onChange={handleDescriptionChange}
                placeholder="Write your blog content here..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <div className="mt-1 flex items-center gap-4">
                <label
                  htmlFor="image"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload size={20} className="mr-2" />
                  {imageFile ? 'Change Image' : imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview && (
                  <div className="w-32 h-32 relative rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              {imageFile && (
                <p className="mt-2 text-sm text-gray-500">{imageFile.name}</p>
              )}
              {!imageFile && currentBlog.img_name && (
                <p className="mt-2 text-sm text-gray-500">Current image will be kept if no new image is uploaded</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold text-navy-900">Tags</h2>

              {existingTags.length > 0 && (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {existingTags.map((tag) => (
                    <div key={tag.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      {editingTagId === tag.id ? (
                        <>
                          <Input
                            value={editingTagName}
                            onChange={(e) => setEditingTagName(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => saveTagEdit(tag.id)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check size={16} />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTagId(null)}
                          >
                            <X size={16} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm text-gray-700">{tag.name}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingTag(tag)}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTag(tag.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter tag name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-primary-500 hover:bg-primary-600 text-white whitespace-nowrap"
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <Button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Blog'}
              </Button>
              <Link href="/admin/blogs">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}

