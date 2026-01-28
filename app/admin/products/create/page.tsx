/**
 * Create Product Page
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { SlugInput } from '@/components/admin/SlugInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createProduct, uploadProductImages, addKeyFeature, addSpecification } from '@/store/slices/productSlice';
import { fetchCategories } from '@/store/slices/categorySlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CustomSelect } from '@/components/ui/custom-select';
import { toast } from 'sonner';
import { ArrowLeft, Upload, X, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const productSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  description: z.string().optional(),
  is_warranty: z.boolean().default(false),
  warranty_period: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface KeyFeature {
  id: string;
  name: string;
}

interface Specification {
  id: string;
  key: string;
  value: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  
  // Images state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // Key features state
  const [keyFeatures, setKeyFeatures] = useState<KeyFeature[]>([]);
  const [newFeature, setNewFeature] = useState('');
  
  // Specifications state
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      is_warranty: false,
      category_id: '',
    },
  });

  const isWarranty = watch('is_warranty');
  const nameValue = watch('name', '');
  const categoryId = watch('category_id');

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (imageFiles.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newFiles = files.slice(0, 5 - imageFiles.length);
    setImageFiles([...imageFiles, ...newFiles]);

    // Generate previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  // Add key feature
  const addKeyFeatureToList = () => {
    if (!newFeature.trim()) {
      toast.error('Feature name is required');
      return;
    }
    setKeyFeatures([...keyFeatures, { id: Date.now().toString(), name: newFeature }]);
    setNewFeature('');
  };

  // Remove key feature
  const removeKeyFeature = (id: string) => {
    setKeyFeatures(keyFeatures.filter((f) => f.id !== id));
  };

  // Add specification
  const addSpecificationToList = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) {
      toast.error('Both key and value are required');
      return;
    }
    setSpecifications([...specifications, { id: Date.now().toString(), key: newSpecKey, value: newSpecValue }]);
    setNewSpecKey('');
    setNewSpecValue('');
  };

  // Remove specification
  const removeSpecification = (id: string) => {
    setSpecifications(specifications.filter((s) => s.id !== id));
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    
    try {
      // Step 1: Create product
      setCurrentStep('Creating product...');
      const productData = { ...data, slug: slug || undefined };
      const productResult = await dispatch(createProduct(productData)).unwrap();
      const productId = productResult.id;

      // Step 2: Upload images (if any)
      if (imageFiles.length > 0) {
        setCurrentStep(`Uploading ${imageFiles.length} image(s)...`);
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });
        await dispatch(uploadProductImages({ id: productId, formData })).unwrap();
      }

      // Step 3: Add key features (if any)
      if (keyFeatures.length > 0) {
        setCurrentStep(`Adding ${keyFeatures.length} key feature(s)...`);
        for (const feature of keyFeatures) {
          await dispatch(addKeyFeature({ productId, data: { name: feature.name } })).unwrap();
        }
      }

      // Step 4: Add specifications (if any)
      if (specifications.length > 0) {
        setCurrentStep(`Adding ${specifications.length} specification(s)...`);
        for (const spec of specifications) {
          await dispatch(addSpecification({ 
            productId, 
            data: { specification_key: spec.key, specification_value: spec.value } 
          })).unwrap();
        }
      }

      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      toast.error(error || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
      setCurrentStep('');
    }
  };

  const categoriesList = Array.isArray(categories) ? categories : [];

  return (
    <ProtectedRoute>
      <div>
        <div className="mb-4 sm:mb-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Back to Products
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-navy-900 mb-1 sm:mb-2">Create New Product</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">Add a new product with images, features, and specifications</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 lg:p-6 border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-navy-900">Basic Information</h2>
              
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  id="category_id"
                  value={watch('category_id') || ''}
                  onChange={(value) => setValue('category_id', value)}
                  placeholder="Select a category"
                  error={!!errors.category_id}
                  options={[
                    { value: '', label: 'Select a category' },
                    ...categoriesList.map((category) => ({
                      value: category.id,
                      label: category.name,
                    })),
                  ]}
                />
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                  placeholder="Product name"
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
                  placeholder="Product title (optional)"
                />
              </div>

              <SlugInput
                value={slug}
                onChange={setSlug}
                autoGenerateFrom={nameValue}
                urlPrefix={`/products/${categoryId ? 'category-slug/' : ''}`}
                table="product"
              />

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Product description (optional)"
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_warranty"
                  {...register('is_warranty')}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="is_warranty" className="text-sm font-medium text-gray-700">
                  Has Warranty
                </label>
              </div>

              {isWarranty && (
                <div>
                  <label htmlFor="warranty_period" className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty Period
                  </label>
                  <Input
                    id="warranty_period"
                    {...register('warranty_period')}
                    placeholder="e.g., 1 year, 2 years"
                  />
                </div>
              )}
            </div>

            {/* Images */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold text-navy-900">Product Images (Max 5)</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images ({imageFiles.length}/5)
                </label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="images"
                    className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
                      imageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload size={20} className="mr-2" />
                    {imageFiles.length === 0 ? 'Upload Images' : 'Add More Images'}
                  </label>
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={imageFiles.length >= 5}
                  />
                </div>
                
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full h-32 relative rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold text-navy-900">Key Features</h2>
              
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Enter feature name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyFeatureToList())}
                />
                <Button
                  type="button"
                  onClick={addKeyFeatureToList}
                  className="bg-primary-500 hover:bg-primary-600 text-white whitespace-nowrap"
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </div>

              {keyFeatures.length > 0 && (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {keyFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-700">{feature.name}</span>
                      <button
                        type="button"
                        onClick={() => removeKeyFeature(feature.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold text-navy-900">Specifications</h2>
              
              <div className="flex gap-2">
                <Input
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Key (e.g., Color)"
                  className="flex-1"
                />
                <Input
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Value (e.g., Black)"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecificationToList())}
                />
                <Button
                  type="button"
                  onClick={addSpecificationToList}
                  className="bg-primary-500 hover:bg-primary-600 text-white whitespace-nowrap"
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </div>

              {specifications.length > 0 && (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {specifications.map((spec) => (
                    <div key={spec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">{spec.key}:</span>
                        <span className="text-sm text-gray-700 ml-2">{spec.value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSpecification(spec.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <Button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? currentStep || 'Creating...' : 'Create Product'}
              </Button>
              <Link href="/admin/products">
                <Button type="button" variant="outline" disabled={isSubmitting}>
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
