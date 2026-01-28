/**
 * Edit Category Page
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
import { fetchCategoryById, updateCategory } from '@/store/slices/categorySlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { getCategoryImageUrl } from '@/utils/image';
const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { currentCategory, isLoading } = useAppSelector((state) => state.category);
  const [slug, setSlug] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const nameValue = watch('name', '');

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentCategory) {
      reset({
        name: currentCategory.name,
        title: currentCategory.title || '',
      });
      setSlug(currentCategory.slug || '');
      if (currentCategory.img_name && currentCategory.base_url) {
        const imageUrl = getCategoryImageUrl(currentCategory.base_url, currentCategory.img_name);
        if (imageUrl) {
          setImagePreview(imageUrl);
        }
      }
    }
  }, [currentCategory, reset]);

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

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.title) {
        formData.append('title', data.title);
      }
      if (slug) {
        formData.append('slug', slug);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await dispatch(updateCategory({ id, formData })).unwrap();
      toast.success('Category updated successfully!');
      router.push('/admin/categories');
    } catch (error: any) {
      toast.error(error || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!currentCategory) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12">
          <p className="text-gray-600">Category not found</p>
          <Link href="/admin/categories">
            <Button className="mt-4">Back to Categories</Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div>
        <div className="mb-6">
          <Link
            href="/admin/categories"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Edit Category</h1>
          <p className="text-gray-600">Update category information</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
                placeholder="Category name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Category title (optional)"
              />
            </div>

            <SlugInput
              value={slug}
              onChange={setSlug}
              autoGenerateFrom={nameValue}
              urlPrefix="/products/"
              table="category"
              excludeId={id}
            />

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <div className="mt-1 flex items-center gap-4">
                <label
                  htmlFor="image"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload size={20} className="mr-2" />
                  {imageFile ? 'Change Image' : 'Upload New Image'}
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
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Category'}
              </Button>
              <Link href="/admin/categories">
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

