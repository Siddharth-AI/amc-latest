"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Sparkles, Package, Grid3x3, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/custom-select";
import { Pagination } from "@/components/ui/pagination";
import { CategoryCardSkeletonGrid } from "@/components/products/category-card-skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyState } from "@/components/ui/empty-state";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPublicCategories } from "@/store/slices/publicCategorySlice";
import { getCategoryImageUrl } from "@/utils/image";
import { cn } from "@/lib/utils";

export default function ProductsClient() {
  const dispatch = useAppDispatch();
  const { categories, isLoading, error, pagination } = useAppSelector((state) => state.publicCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'created_at'>('created_at');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPublicCategories({ page: currentPage, limit: 12 }));
  }, [dispatch, currentPage]);

  const filteredCategories = useMemo(() => {
    let result = categories;
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(query) ||
          (category.title && category.title.toLowerCase().includes(query))
      );
    }
    
    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    return result;
  }, [searchQuery, categories, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Section className="relative pt-24 sm:pt-32 pb-10 sm:pb-12 md:pb-14 bg-gradient-to-br from-navy-900 via-slate-900 to-navy-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center px-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mt-10 rounded-full bg-primary-500/20 backdrop-blur-sm border border-primary-500/30 text-primary-300 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wider">
                Our Solutions
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Explore Our{" "}
              <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
                Solutions
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
              Comprehensive range of POS and retail solutions designed to transform your business
            </p>
          </div>
        </Container>
      </Section>

      {/* Stats Bar */}
      {!searchQuery && (
        <Section className="py-4 sm:py-5 md:py-6 bg-slate-50 border-b border-slate-200">
          <Container>
            <div className="max-w-5xl mx-auto px-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 mb-1">
                    {pagination.total}+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 font-medium">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 mb-1">
                    100+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 font-medium">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 mb-1">
                    20+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 font-medium">Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-navy-900 mb-1">
                    1000+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 font-medium">Clients</div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Categories Section */}
      <Section className="py-6 sm:py-8 md:py-10 lg:py-12">
        <Container>
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="mb-6 sm:mb-8 md:mb-10">
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-navy-900 mb-3 sm:mb-4">
                    Product Categories
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl">
                    Browse through our comprehensive range of solutions
                  </p>
                </div>
                
                {/* Search and Sort */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  {/* Search Bar */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-11 pl-10 pr-10 text-sm rounded-lg border-2 border-slate-200 focus:border-primary-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="w-full sm:w-[180px]">
                    <CustomSelect
                      value={sortBy}
                      onChange={(value) => setSortBy(value as 'name' | 'created_at')}
                      placeholder="Sort by"
                      height="44px"
                      options={[
                        { value: "created_at", label: "Newest First" },
                        { value: "name", label: "Name (A-Z)" },
                      ]}
                    />
                  </div>
                </div>
                
                {/* Search Results Count */}
                {searchQuery && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-sm text-slate-600">
                      Found <span className="font-bold text-primary-600">{filteredCategories.length}</span>{" "}
                      {filteredCategories.length === 1 ? "category" : "categories"} matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <CategoryCardSkeletonGrid count={12} />
              </div>
            ) : error ? (
              <ErrorMessage
                message={error}
                onRetry={() => dispatch(fetchPublicCategories({ page: currentPage, limit: 12 }))}
              />
            ) : filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {filteredCategories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/products/${category.slug}`}
                    className="group block animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="h-full rounded-xl sm:rounded-2xl bg-white border-2 border-slate-100 overflow-hidden hover:border-primary-300 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        {category.base_url && category.img_name ? (
                          <Image
                            src={getCategoryImageUrl(category.base_url, category.img_name) || '/placeholder.png'}
                            alt={category.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Package className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/30 to-transparent" />

                        {/* Product Count Badge - Removed as not in DB */}
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 md:p-6">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-navy-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                          {category.name}
                        </h3>
                        {category.title && (
                          <p className="text-xs sm:text-sm md:text-base text-slate-600 line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
                            {category.title}
                          </p>
                        )}

                        {/* View Link */}
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-600 group-hover:gap-3 transition-all">
                          <span className="group-hover:underline">View Products</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Grid3x3}
                title="No Categories Found"
                description={`No categories found matching "${searchQuery}"`}
                action={{
                  label: "Clear Search & Show All",
                  onClick: () => setSearchQuery("")
                }}
              />
            )}
            
            {/* Pagination */}
            {!searchQuery && !isLoading && !error && pagination.totalPages > 1 && (
              <div className="mt-8 sm:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section className="py-8 sm:py-10 md:py-12 bg-slate-50">
        <Container>
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "🚀",
                  title: "Latest Technology",
                  description: "Cutting-edge POS solutions powered by modern technology"
                },
                {
                  icon: "🛡️",
                  title: "Reliable & Secure",
                  description: "Enterprise-grade security with 99.9% uptime guarantee"
                },
                {
                  icon: "💎",
                  title: "Premium Quality",
                  description: "Top-tier products from leading global manufacturers"
                },
                {
                  icon: "🎯",
                  title: "Custom Solutions",
                  description: "Tailored packages designed for your specific needs"
                },
                {
                  icon: "🔧",
                  title: "Expert Support",
                  description: "24/7 technical assistance from certified professionals"
                },
                {
                  icon: "⚡",
                  title: "Fast Deployment",
                  description: "Quick installation and seamless integration"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-navy-900 via-slate-900 to-navy-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Get in touch with our experts to find the perfect solution for your needs
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 rounded-xl font-bold hover:scale-105 transition-all shadow-xl"
                asChild
              >
                <Link href="/contact">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-xl font-bold"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

