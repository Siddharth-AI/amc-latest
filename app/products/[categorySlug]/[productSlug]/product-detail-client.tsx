"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Package, Shield, TrendingUp, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { StickyBackButton } from "@/components/products/sticky-back-button";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { ProductDetailSkeleton } from "@/components/products/product-detail-skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPublicProductBySlug } from "@/store/slices/publicProductSlice";
import { fetchPublicCategoryBySlug } from "@/store/slices/publicCategorySlice";
import type { Product, Category } from "@/lib/types";

interface ProductDetailClientProps {
  productSlug: string;
  categorySlug: string;
}

export function ProductDetailClient({ productSlug, categorySlug }: ProductDetailClientProps) {
  const dispatch = useAppDispatch();
  const { selectedProduct, isLoading, error } = useAppSelector((state) => state.publicProduct);
  const { selectedCategory } = useAppSelector((state) => state.publicCategory);

  useEffect(() => {
    dispatch(fetchPublicProductBySlug(productSlug));
    dispatch(fetchPublicCategoryBySlug(categorySlug));
  }, [dispatch, productSlug, categorySlug]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (error) return <ErrorMessage message={error} onRetry={() => dispatch(fetchPublicProductBySlug(productSlug))} />;
  if (!selectedProduct) return <ErrorMessage message="Product not found" />;

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Back Button */}
      <StickyBackButton
        backHref={`/products/${categorySlug}`}
        backLabel={selectedCategory?.name || "Category"}
      />

      {/* Hero Section */}
      <Section className="relative pt-4 sm:pt-6 md:pt-8 pb-6 sm:pb-8 md:pb-10 bg-gradient-to-b from-slate-50 to-white">
        <Container>
          <div className="max-w-7xl mx-auto px-4 mt-14">

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {/* Product Gallery */}
              <ProductImageGallery
                images={selectedProduct.images || []}
                productName={selectedProduct.name}
              />

              {/* Product Info */}
              <div className="lg:sticky lg:top-24">
                {/* Brand Badge */}
                <div className="mb-4 sm:mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-bold">
                    <Package className="w-4 h-4" />
                    {selectedCategory?.name}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-navy-900 mb-3 sm:mb-4 leading-tight">
                  {selectedProduct.name}
                </h1>

                {selectedProduct.title && (
                  <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-4 sm:mb-6 font-medium">
                    {selectedProduct.title}
                  </p>
                )}

                {/* Description */}
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4 sm:mb-6">
                  {selectedProduct.description}
                </p>

               

                {/* Warranty Badge */}
                {selectedProduct.is_warranty && (
                  <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-900">{selectedProduct.warranty_period} Warranty Included</p>

                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <Button
                    size="lg"
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base rounded-xl font-bold shadow-lg hover:scale-105 transition-all"
                    asChild
                  >
                    <Link href="/enquiry">
                      Request Quote
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 border-2 border-slate-300 hover:border-primary-500 text-navy-900 hover:text-primary-600 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base rounded-xl font-bold"
                    asChild
                  >
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xs font-bold text-navy-900">Verified</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                    <p className="text-xs font-bold text-navy-900">Popular</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <p className="text-xs font-bold text-navy-900">Rated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Key Features */}
      <Section className="py-6 sm:py-8 md:py-10 bg-white">
        <Container>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-4">
                Key Features
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                Everything you need to know about this product
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {selectedProduct.key_features?.map((feature: any, index: number) => (
                <div
                  key={index}
                  className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-primary-200 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      {feature.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Specifications */}
      <Section className="py-6 sm:py-8 md:py-10 bg-slate-50">
        <Container>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-4">
                Specifications
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                Technical details and specifications
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {selectedProduct.specifications && Array.isArray(selectedProduct.specifications) && selectedProduct.specifications.map(
                      (spec: any, index: number) => (
                        <tr
                          key={spec.id || index}
                          className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        >
                          <td className="px-6 py-4 sm:py-5 font-bold text-navy-900 border-r border-slate-200 text-sm sm:text-base">
                            {spec.specification_key}
                          </td>
                          <td className="px-6 py-4 sm:py-5 text-slate-600 text-sm sm:text-base">
                            {spec.specification_value}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Products */}
      {/* {selectedProduct.relatedProducts && selectedProduct.relatedProducts.length > 0 && (
        <Section className="py-6 sm:py-8 md:py-10 bg-white">
          <Container>
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-6 sm:mb-8 md:mb-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-4">
                  Related Products
                </h2>
                <p className="text-base sm:text-lg text-slate-600">
                  You might also be interested in
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {selectedProduct.relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                  />
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )} */}

      {/* CTA Section */}
      <Section className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-navy-900 via-slate-900 to-navy-900">
        <Container>
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-6 sm:mb-8">
              Contact our team to learn more about this product and get a customized quote
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary-500 hover:bg-primary-600 text-white px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base rounded-xl font-bold shadow-xl hover:scale-105 transition-all"
                asChild
              >
                <Link href="/enquiry">
                  Request Quote
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base rounded-xl font-bold"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

