/**
 * Create Category Page
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { SlugInput } from '@/components/admin/SlugInput';
import { useAppDispatch } from '@/store/hooks';
import { createCategory } from '@/store/slices/categorySlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CreateCategoryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [slug, setSlug] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const nameValue = watch('name', '');

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

      await dispatch(createCategory(formData)).unwrap();
      toast.success('Category created successfully!');
      router.push('/admin/categories');
    } catch (error: any) {
      toast.error(error || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="mb-4 sm:mb-6">
          <Link
            href="/admin/categories"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Back to Categories
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-navy-900 mb-1 sm:mb-2">Create New Category</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">Add a new product category</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 lg:p-6 border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
                  {imageFile ? 'Change Image' : 'Upload Image'}
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
                {isSubmitting ? 'Creating...' : 'Create Category'}
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

