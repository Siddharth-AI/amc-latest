"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Search, X } from "lucide-react";
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
  fetchPublicProducts,
  setFilters,
  clearFilters,
} from "@/store/slices/publicProductSlice";
import { fetchPublicCategories } from "@/store/slices/publicCategorySlice";

export function AllProductsClient() {
  const dispatch = useAppDispatch();
  const { products, isLoading, error, pagination, filters } = useAppSelector(
    (state) => state.publicProduct,
  );
  const { categories } = useAppSelector((state) => state.publicCategory);

  const [page, setPage] = useState(1);
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    dispatch(fetchPublicCategories({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPublicProducts({ page, limit: 12, ...(filters as any) }));
  }, [dispatch, page, filters]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = () => {
    dispatch(setFilters({ search: localSearch }));
    setPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    dispatch(setFilters({ category_id: categoryId }));
    setPage(1);
  };

  const handleSortChange = (sortBy: string) => {
    dispatch(setFilters({ sort_by: sortBy as "name" | "price" | "brand" }));
    setPage(1);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalSearch("");
    setPage(1);
  };

  const hasActiveFilters =
    filters.search || filters.category_id || filters.sort_by !== "name";

  return (
    <div className="min-h-screen bg-white">
      <StickyBackButton
        backHref="/products"
        backLabel="Categories"
        productCount={pagination.total}
      />

      {/* Hero Section */}
      <Section className="relative pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-10 md:pb-12 bg-gradient-to-b from-slate-900 to-navy-900 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold text-white mb-6">
              <Package className="w-4 h-4" />
              {pagination.total} Products Available
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
              All Products
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Browse our complete range of POS systems, retail solutions, and
              business technology products
            </p>
          </div>
        </Container>
      </Section>

      {/* Products Section */}
      <Section className="py-4 sm:py-6 md:py-8">
        <Container>
          <div className="max-w-7xl mx-auto px-4">
            {/* Results Header */}
            {/* <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 mb-2">
                  {hasActiveFilters ? "Search Results" : "All Products"}
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  {pagination.total} product{pagination.total !== 1 ? "s" : ""} found
                </p>
              </div>
            </div> */}

            {/* Search and Filter Bar */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                {/* Search Input */}
                <div className="flex-1 min-w-0 flex gap-2">
                  <div className="relative flex-1 h-[44px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full h-full pl-12 pr-4 text-sm sm:text-base rounded-xl border-2 border-slate-200 focus:border-primary-500 transition-colors bg-white"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="h-[44px] bg-primary-500 hover:bg-primary-600 text-white px-6 rounded-xl font-bold">
                    Search
                  </Button>
                </div>

                {/* Filter by Category */}
                <div className="w-full sm:w-[200px]">
                  <CustomSelect
                    value={filters.category_id || ""}
                    onChange={handleCategoryChange}
                    placeholder="All Categories"
                    height="44px"
                    options={[
                      { value: "", label: "All Categories" },
                      ...categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                      })),
                    ]}
                  />
                </div>

                {/* Sort By */}
                <div className="w-full sm:w-[180px]">
                  <CustomSelect
                    value={filters.sort_by}
                    onChange={handleSortChange}
                    placeholder="Sort by"
                    height="44px"
                    options={[
                      { value: "name", label: "Name (A-Z)" },
                      { value: "price", label: "Price (Low to High)" },
                      { value: "brand", label: "Brand (A-Z)" },
                    ]}
                  />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
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
                    fetchPublicProducts({
                      page,
                      limit: 12,
                      ...(filters as any),
                    }),
                  )
                }
              />
            ) : products?.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                  ))}
                </div>
                {pagination.totalPages > 1 && (
                  <div className="mt-8 sm:mt-12">
                    <Pagination
                      currentPage={page}
                      totalPages={pagination.totalPages}
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
                    ? "Try adjusting your search or filters"
                    : "No products available"
                }
                action={
                  hasActiveFilters
                    ? { label: "Clear Filters", onClick: handleClearFilters }
                    : undefined
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
