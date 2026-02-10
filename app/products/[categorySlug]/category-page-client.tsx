"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  TrendingUp,
  ArrowRight,
  Search,
  Filter,
  X,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/custom-select";
import { StickyBackButton } from "@/components/products/sticky-back-button";
import { Pagination } from "@/components/ui/pagination";
import { ProductCardSkeletonGrid } from "@/components/products/product-card-skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyState } from "@/components/ui/empty-state";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPublicCategoryBySlug,
  fetchCategoryProducts,
} from "@/store/slices/publicCategorySlice";
import { getCategoryImageUrl } from "@/utils/image";
import type { Product } from "@/lib/types";
import type { Category } from "@/lib/types";

// const categoryImages: Record<string, string> = {
//   "pos-systems": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
//   "retail-solutions": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
//   "software": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
//   "hardware": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
//   "support": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
//   "custom": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
// };

interface CategoryPageClientProps {
  categorySlug: string;
}

export function CategoryPageClient({ categorySlug }: CategoryPageClientProps) {
  const dispatch = useAppDispatch();
  const {
    selectedCategory,
    categoryProducts,
    isLoading,
    error,
    productsPagination,
  } = useAppSelector((state) => state.publicCategory);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "created_at">("name");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPublicCategoryBySlug(categorySlug));
  }, [dispatch, categorySlug]);

  useEffect(() => {
    dispatch(
      fetchCategoryProducts({
        slug: categorySlug,
        page,
        limit: 12,
        search: searchQuery,
        sort_by: sortBy,
      }),
    );
  }, [dispatch, categorySlug, page, searchQuery, sortBy]);

  const hasActiveFilters = searchQuery.trim();

  const clearFilters = () => {
    setSearchQuery("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as "name" | "created_at");
    setPage(1);
  };

  const categoryImage = selectedCategory
    ? getCategoryImageUrl(
        selectedCategory.base_url,
        selectedCategory.img_name,
      ) || "/placeholder.png"
    : "/placeholder.png";

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Back Button - Adjusts position based on header visibility */}
      <StickyBackButton
        backHref="/products"
        backLabel="All Softwares"
        productCount={productsPagination.total}
      />

      {/* Hero Section - Matching News & About Pages Style */}
      <Section className="relative pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-10 md:pb-12 bg-gradient-to-b from-slate-900 to-navy-900 overflow-hidden">
        {/* Simple Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
              {/* Content */}
              <div className="text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 mt-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold text-white mb-6">
                  <TrendingUp className="w-4 h-4" />
                  {productsPagination.total} Products Available
                </div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
                  {selectedCategory?.name || "Loading..."}
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {selectedCategory?.title || ""}
                </p>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="bg-primary-500 hover:bg-primary-600 text-white px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base rounded-xl font-bold shadow-lg hover:scale-105 transition-all"
                    asChild>
                    <Link href="/enquiry">
                      Get Quote
                      <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base rounded-xl font-bold"
                    asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>

              {/* Category Image */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                {categoryImage ? (
                  <Image
                    src={categoryImage}
                    alt={selectedCategory?.name || "Category"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                    quality={90}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-navy-900/20 to-transparent" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Products Section */}
      <Section className="py-4 sm:py-6 md:py-8">
        <Container>
          <div className="max-w-7xl mx-auto px-4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 mb-2">
                  {hasActiveFilters ? "Search Results" : "All Softwares"}
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  {productsPagination.total} product
                  {productsPagination.total !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {/* Search and Filter Bar - All in One Line */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                {/* Search Input */}
                <div className="flex-1 min-w-0">
                  <div className="relative h-[44px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full h-full pl-12 pr-4 text-sm sm:text-base rounded-xl border-2 border-slate-200 focus:border-primary-500 transition-colors bg-white"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div className="w-full sm:w-[180px]">
                  <CustomSelect
                    value={sortBy}
                    onChange={handleSortChange}
                    placeholder="Sort by"
                    height="44px"
                    options={[
                      { value: "name", label: "Name (A-Z)" },
                      { value: "created_at", label: "Date Created" },
                    ]}
                  />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full sm:w-auto h-[44px] border-2 border-slate-300 hover:border-primary-500 text-slate-700 hover:text-primary-600 font-bold whitespace-nowrap px-4 sm:px-6">
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <ProductCardSkeletonGrid count={12} />
            ) : error ? (
              <ErrorMessage
                message={error}
                onRetry={() =>
                  dispatch(
                    fetchCategoryProducts({
                      slug: categorySlug,
                      page,
                      limit: 12,
                      search: searchQuery,
                      sort_by: sortBy,
                    }),
                  )
                }
              />
            ) : categoryProducts.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}
                </div>
                {productsPagination.totalPages > 1 && (
                  <div className="mt-8 sm:mt-12">
                    <Pagination
                      currentPage={page}
                      totalPages={productsPagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={Search}
                title="No Softwares Found"
                description={
                  hasActiveFilters
                    ? "Try adjusting your search"
                    : "We're working on adding more products"
                }
                action={
                  hasActiveFilters
                    ? { label: "Clear Filters", onClick: clearFilters }
                    : {
                        label: "Browse All Softwares",
                        onClick: () => (window.location.href = "/products"),
                      }
                }
              />
            )}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-6 sm:py-8 md:py-10 bg-gradient-to-br from-navy-900 via-slate-900 to-navy-900">
        <Container>
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-6 sm:mb-8">
              Our experts are ready to help you find the perfect solution
            </p>
            <Button
              size="lg"
              className="bg-primary-500 hover:bg-primary-600 text-white px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base rounded-xl font-bold hover:scale-105 transition-all shadow-xl"
              asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
