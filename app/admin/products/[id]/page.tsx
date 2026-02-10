/**
 * Edit Product Page
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { SlugInput } from "@/components/admin/SlugInput";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProductById,
  updateProduct,
  uploadProductImages,
  deleteProductImage,
  updateKeyFeature,
  deleteKeyFeature,
  addKeyFeature,
  updateSpecification,
  deleteSpecification,
  addSpecification,
} from "@/store/slices/productSlice";
import { fetchCategories } from "@/store/slices/categorySlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CustomSelect } from "@/components/ui/custom-select";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, Plus, Trash2, Edit2, Check } from "lucide-react";
import Link from "next/link";

const productSchema = z.object({
  category_id: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  description: z.string().optional(),
  is_warranty: z.boolean().default(false),
  warranty_period: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { currentProduct, isLoading } = useAppSelector(
    (state) => state.product,
  );
  const { categories } = useAppSelector((state) => state.category);
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState("");

  // Images state
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Key Features state
  const [existingFeatures, setExistingFeatures] = useState<any[]>([]);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [editingFeatureName, setEditingFeatureName] = useState("");
  const [newFeature, setNewFeature] = useState("");

  // Specifications state
  const [existingSpecs, setExistingSpecs] = useState<any[]>([]);
  const [editingSpecId, setEditingSpecId] = useState<string | null>(null);
  const [editingSpecKey, setEditingSpecKey] = useState("");
  const [editingSpecValue, setEditingSpecValue] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
  });

  const isWarranty = watch("is_warranty");
  const nameValue = watch("name", "");
  const categoryId = watch("category_id");

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, limit: 100 }));
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentProduct) {
      reset({
        category_id: currentProduct.category_id,
        name: currentProduct.name,
        title: currentProduct.title || "",
        description: currentProduct.description || "",
        is_warranty: currentProduct.is_warranty,
        warranty_period: currentProduct.warranty_period || "",
      });
      setSlug(currentProduct.slug || "");
      setExistingImages(currentProduct.images || []);
      setExistingFeatures(currentProduct.key_features || []);
      setExistingSpecs(currentProduct.specifications || []);
    }
  }, [currentProduct, reset]);

  // Handle new image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages =
      existingImages.length -
      imagesToDelete.length +
      newImageFiles.length +
      files.length;

    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const newFiles = files.slice(
      0,
      5 -
        (existingImages.length - imagesToDelete.length + newImageFiles.length),
    );
    setNewImageFiles([...newImageFiles, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove new image before upload
  const removeNewImage = (index: number) => {
    setNewImageFiles(newImageFiles.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  // Mark existing image for deletion
  const markImageForDeletion = (imageId: string) => {
    setImagesToDelete([...imagesToDelete, imageId]);
  };

  // Unmark image for deletion
  const unmarkImageForDeletion = (imageId: string) => {
    setImagesToDelete(imagesToDelete.filter((id) => id !== imageId));
  };

  // Toggle feature status
  const handleToggleFeature = async (
    featureId: string,
    currentStatus: boolean,
  ) => {
    // Optimistic update
    setExistingFeatures(
      existingFeatures.map((f) =>
        f.id === featureId ? { ...f, is_active: !currentStatus } : f,
      ),
    );

    try {
      await dispatch(
        updateKeyFeature({
          id: featureId,
          data: { is_active: !currentStatus },
        }),
      ).unwrap();
      toast.success("Feature status updated");
    } catch (error: any) {
      // Revert on error
      setExistingFeatures(
        existingFeatures.map((f) =>
          f.id === featureId ? { ...f, is_active: currentStatus } : f,
        ),
      );
      toast.error(error || "Failed to update feature");
    }
  };

  // Start editing feature
  const startEditingFeature = (feature: any) => {
    setEditingFeatureId(feature.id);
    setEditingFeatureName(feature.name);
  };

  // Save feature edit
  const saveFeatureEdit = async (featureId: string) => {
    if (!editingFeatureName.trim()) {
      toast.error("Feature name is required");
      return;
    }
    try {
      await dispatch(
        updateKeyFeature({ id: featureId, data: { name: editingFeatureName } }),
      ).unwrap();
      setExistingFeatures(
        existingFeatures.map((f) =>
          f.id === featureId ? { ...f, name: editingFeatureName } : f,
        ),
      );
      setEditingFeatureId(null);
      toast.success("Feature updated");
    } catch (error: any) {
      toast.error(error || "Failed to update feature");
    }
  };

  // Delete feature
  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm("Are you sure you want to permanently delete this feature?"))
      return;
    try {
      await dispatch(deleteKeyFeature(featureId)).unwrap();
      setExistingFeatures(existingFeatures.filter((f) => f.id !== featureId));
      toast.success("Feature deleted");
    } catch (error: any) {
      toast.error(error || "Failed to delete feature");
    }
  };

  // Add new feature
  const handleAddFeature = async () => {
    if (!newFeature.trim()) {
      toast.error("Feature name is required");
      return;
    }
    try {
      const result = await dispatch(
        addKeyFeature({ productId: id, data: { name: newFeature } }),
      ).unwrap();
      setExistingFeatures([...existingFeatures, result]);
      setNewFeature("");
      toast.success("Feature added");
    } catch (error: any) {
      toast.error(error || "Failed to add feature");
    }
  };

  // Toggle specification status
  const handleToggleSpec = async (specId: string, currentStatus: boolean) => {
    // Optimistic update
    setExistingSpecs(
      existingSpecs.map((s) =>
        s.id === specId ? { ...s, is_active: !currentStatus } : s,
      ),
    );

    try {
      await dispatch(
        updateSpecification({
          id: specId,
          data: { is_active: !currentStatus },
        }),
      ).unwrap();
      toast.success("Specification status updated");
    } catch (error: any) {
      // Revert on error
      setExistingSpecs(
        existingSpecs.map((s) =>
          s.id === specId ? { ...s, is_active: currentStatus } : s,
        ),
      );
      toast.error(error || "Failed to update specification");
    }
  };

  // Start editing specification
  const startEditingSpec = (spec: any) => {
    setEditingSpecId(spec.id);
    setEditingSpecKey(spec.specification_key);
    setEditingSpecValue(spec.specification_value);
  };

  // Save specification edit
  const saveSpecEdit = async (specId: string) => {
    if (!editingSpecKey.trim() || !editingSpecValue.trim()) {
      toast.error("Both key and value are required");
      return;
    }
    try {
      await dispatch(
        updateSpecification({
          id: specId,
          data: {
            specification_key: editingSpecKey,
            specification_value: editingSpecValue,
          },
        }),
      ).unwrap();
      setExistingSpecs(
        existingSpecs.map((s) =>
          s.id === specId
            ? {
                ...s,
                specification_key: editingSpecKey,
                specification_value: editingSpecValue,
              }
            : s,
        ),
      );
      setEditingSpecId(null);
      toast.success("Specification updated");
    } catch (error: any) {
      toast.error(error || "Failed to update specification");
    }
  };

  // Delete specification
  const handleDeleteSpec = async (specId: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this specification?",
      )
    )
      return;
    try {
      await dispatch(deleteSpecification(specId)).unwrap();
      setExistingSpecs(existingSpecs.filter((s) => s.id !== specId));
      toast.success("Specification deleted");
    } catch (error: any) {
      toast.error(error || "Failed to delete specification");
    }
  };

  // Add new specification
  const handleAddSpec = async () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) {
      toast.error("Both key and value are required");
      return;
    }
    try {
      const result = await dispatch(
        addSpecification({
          productId: id,
          data: {
            specification_key: newSpecKey,
            specification_value: newSpecValue,
          },
        }),
      ).unwrap();
      setExistingSpecs([...existingSpecs, result]);
      setNewSpecKey("");
      setNewSpecValue("");
      toast.success("Specification added");
    } catch (error: any) {
      toast.error(error || "Failed to add specification");
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      // Step 1: Update basic info
      setCurrentStep("Updating product info...");
      const productData = { ...data, slug: slug || undefined };
      await dispatch(updateProduct({ id, data: productData })).unwrap();

      // Step 2: Delete marked images
      if (imagesToDelete.length > 0) {
        setCurrentStep(`Deleting ${imagesToDelete.length} image(s)...`);
        for (const imageId of imagesToDelete) {
          await dispatch(deleteProductImage(imageId)).unwrap();
        }
      }

      // Step 3: Upload new images
      if (newImageFiles.length > 0) {
        setCurrentStep(`Uploading ${newImageFiles.length} new image(s)...`);
        const formData = new FormData();
        newImageFiles.forEach((file) => {
          formData.append("images", file);
        });
        await dispatch(uploadProductImages({ id, formData })).unwrap();
      }

      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error || "Failed to update product");
    } finally {
      setIsSubmitting(false);
      setCurrentStep("");
    }
  };

  const categoriesList = Array.isArray(categories) ? categories : [];

  if (isLoading && !currentProduct) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!currentProduct) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12">
          <p className="text-gray-600">Software not found</p>
          <Link href="/admin/products">
            <Button className="mt-4">Back to Software</Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  const totalImages =
    existingImages.length - imagesToDelete.length + newImageFiles.length;

  return (
    <ProtectedRoute>
      <div>
        <div className="mb-4 sm:mb-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-3 sm:mb-4 text-sm sm:text-base">
            <ArrowLeft size={16} className="sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Back to Software
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-navy-900 mb-1 sm:mb-2">
            Edit Product
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            Update product information
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 lg:p-6 border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-navy-900">
                Basic Information
              </h2>

              <div>
                <label
                  htmlFor="category_id"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  id="category_id"
                  value={watch("category_id") || ""}
                  onChange={(value) => setValue("category_id", value)}
                  placeholder="Select a category"
                  error={!!errors.category_id}
                  options={[
                    { value: "", label: "Select a category" },
                    ...categoriesList.map((category) => ({
                      value: category.id,
                      label: category.name,
                    })),
                  ]}
                />
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category_id.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                  placeholder="Product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Product title (optional)"
                />
              </div>

              <SlugInput
                value={slug}
                onChange={setSlug}
                autoGenerateFrom={nameValue}
                urlPrefix={`/products/${categoryId ? "category-slug/" : ""}`}
                table="product"
                excludeId={id}
              />

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Product description (optional)"
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_warranty"
                  {...register("is_warranty")}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label
                  htmlFor="is_warranty"
                  className="text-sm font-medium text-gray-700">
                  Has Warranty
                </label>
              </div>

              {isWarranty && (
                <div>
                  <label
                    htmlFor="warranty_period"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty Period
                  </label>
                  <Input
                    id="warranty_period"
                    {...register("warranty_period")}
                    placeholder="e.g., 1 year, 2 years"
                  />
                </div>
              )}
            </div>

            {/* Images */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold text-navy-900">
                Product Images ({totalImages}/5)
              </h2>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Existing Images
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <div
                          className={`w-full h-32 relative rounded-lg overflow-hidden border-2 ${
                            imagesToDelete.includes(image.id)
                              ? "border-red-500 opacity-50"
                              : "border-gray-200"
                          }`}>
                          <img
                            src={`${image.base_url}${image.name}`}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {imagesToDelete.includes(image.id) ? (
                          <button
                            type="button"
                            onClick={() => unmarkImageForDeletion(image.id)}
                            className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                            <Check size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => markImageForDeletion(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {newImagePreviews.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    New Images
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {newImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full h-32 relative rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={preview}
                            alt={`New ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {totalImages < 5 && (
                <div>
                  <label
                    htmlFor="images"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Upload size={20} className="mr-2" />
                    Add Images
                  </label>
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Key Features */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold text-navy-900">
                Key Features
              </h2>

              {existingFeatures.length > 0 && (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {existingFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      {editingFeatureId === feature.id ? (
                        <>
                          <Input
                            value={editingFeatureName}
                            onChange={(e) =>
                              setEditingFeatureName(e.target.value)
                            }
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => saveFeatureEdit(feature.id)}
                            className="bg-green-500 hover:bg-green-600">
                            <Check size={16} />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingFeatureId(null)}>
                            <X size={16} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-sm text-gray-700">
                            {feature.name}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleFeature(feature.id, feature.is_active)
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              feature.is_active ? "bg-green-500" : "bg-gray-300"
                            }`}>
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                feature.is_active
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingFeature(feature)}>
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFeature(feature.id)}
                            className="text-red-600 hover:text-red-700">
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Enter feature name"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddFeature())
                  }
                />
                <Button
                  type="button"
                  onClick={handleAddFeature}
                  className="bg-primary-500 hover:bg-primary-600 text-white whitespace-nowrap">
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold text-navy-900">
                Specifications
              </h2>

              {existingSpecs.length > 0 && (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {existingSpecs.map((spec) => (
                    <div
                      key={spec.id}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      {editingSpecId === spec.id ? (
                        <>
                          <Input
                            value={editingSpecKey}
                            onChange={(e) => setEditingSpecKey(e.target.value)}
                            placeholder="Key"
                            className="flex-1"
                          />
                          <Input
                            value={editingSpecValue}
                            onChange={(e) =>
                              setEditingSpecValue(e.target.value)
                            }
                            placeholder="Value"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => saveSpecEdit(spec.id)}
                            className="bg-green-500 hover:bg-green-600">
                            <Check size={16} />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSpecId(null)}>
                            <X size={16} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">
                              {spec.specification_key}:
                            </span>
                            <span className="text-sm text-gray-700 ml-2">
                              {spec.specification_value}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleSpec(spec.id, spec.is_active)
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              spec.is_active ? "bg-green-500" : "bg-gray-300"
                            }`}>
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                spec.is_active
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => startEditingSpec(spec)}>
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteSpec(spec.id)}
                            className="text-red-600 hover:text-red-700">
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

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
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddSpec())
                  }
                />
                <Button
                  type="button"
                  onClick={handleAddSpec}
                  className="bg-primary-500 hover:bg-primary-600 text-white whitespace-nowrap">
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <Button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white"
                disabled={isSubmitting}>
                {isSubmitting ? currentStep || "Updating..." : "Update Product"}
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
