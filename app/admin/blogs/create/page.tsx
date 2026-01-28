/**
 * Create Blog Page
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
import { createBlog, addBlogTag } from '@/store/slices/blogSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import Link from 'next/link';
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

export default function CreateBlogPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [slug, setSlug] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  
  // Tags state
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [newTag, setNewTag] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  const titleValue = watch('title', '');

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

  // Add tag to list
  const addTagToList = () => {
    if (!newTag.trim()) {
      toast.error('Tag name is required');
      return;
    }
    setTags([...tags, { id: Date.now().toString(), name: newTag }]);
    setNewTag('');
  };

  // Remove tag from list
  const removeTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      // Step 1: Create blog
      setCurrentStep('Creating blog...');
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', description || data.description);
      if (slug) {
        formData.append('slug', slug);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const blogResult = await dispatch(createBlog(formData)).unwrap();
      const blogId = blogResult.id;

      // Step 2: Add tags (if any)
      if (tags.length > 0) {
        setCurrentStep(`Adding ${tags.length} tag(s)...`);
        for (const tag of tags) {
          await dispatch(addBlogTag({ blogId, data: { name: tag.name } })).unwrap();
        }
      }

      toast.success('Blog created successfully!');
      router.push('/admin/blogs');
    } catch (error: any) {
      toast.error(error || 'Failed to create blog');
    } finally {
      setIsSubmitting(false);
      setCurrentStep('');
    }
  };

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
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Create New Blog</h1>
          <p className="text-gray-600">Add a new blog post</p>
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

            {/* Tags */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold text-navy-900">Tags</h2>
              
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter tag name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTagToList())}
                />
                <Button
                  type="button"
                  onClick={addTagToList}
                  className="bg-primary-500 hover:bg-primary-600 text-white whitespace-nowrap"
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-700">{tag.name}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <Button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? currentStep || 'Creating...' : 'Create Blog'}
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

