"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/custom-select";
import { BlogCard } from "@/components/news/blog-card";
import { BlogCardSkeletonGrid } from "@/components/news/blog-card-skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPublicBlogs } from "@/store/slices/publicBlogSlice";

gsap.registerPlugin(ScrollTrigger);

export default function NewsPage() {
  const dispatch = useAppDispatch();
  const { blogs, loading, error, pagination } = useAppSelector((state) => state.publicBlog);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'created_at' | 'title'>('created_at');
  const [page, setPage] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchPublicBlogs({ page, limit: 12 }));
  }, [dispatch, page]);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll(".animate-in"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (gridRef.current && !loading) {
      const cards = gridRef.current.querySelectorAll(".news-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [blogs, loading]);

  const filteredBlogs = blogs
    .filter((blog) => {
      const matchesSearch = searchQuery === "" || 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        blog.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortBy('created_at');
  };

  const hasActiveFilters = searchQuery || sortBy !== 'created_at';

  return (
    <div className="min-h-screen bg-white">
      <Section className="relative pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-14 bg-gradient-to-b from-slate-900 to-navy-900 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <Container className="relative z-10">
          <div ref={heroRef} className="max-w-4xl mx-auto text-center px-4">
            <div className="animate-in inline-flex items-center gap-2 px-4 py-2 mt-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold text-white mb-6">
              <TrendingUp className="w-4 h-4" />
              Latest Updates
            </div>

            <h1 className="animate-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
              News & Insights
            </h1>

            <p className="animate-in text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Stay updated with our latest product launches, industry insights, and company news
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-6 sm:py-8 md:py-10 lg:py-12">
        <Container>
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-6 sm:mb-8 md:mb-10">
              <div className="mb-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-navy-900 mb-3 sm:mb-4">
                  All Articles
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-slate-600">
                  {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""} found
                </p>
              </div>
              
              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 text-sm rounded-lg border-2 border-slate-200 focus:border-primary-500"
                  />
                </div>
                
                {/* Sort Dropdown */}
                <div className="w-full sm:w-[180px]">
                  <CustomSelect
                    value={sortBy}
                    onChange={(value) => setSortBy(value as 'created_at' | 'title')}
                    placeholder="Sort by"
                    height="44px"
                    options={[
                      { value: "created_at", label: "Newest First" },
                      { value: "title", label: "Title (A-Z)" },
                    ]}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <BlogCardSkeletonGrid count={12} />
            ) : error ? (
              <ErrorMessage
                message={error}
                onRetry={() => dispatch(fetchPublicBlogs({ page, limit: 12 }))}
              />
            ) : filteredBlogs.length > 0 ? (
              <>
                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredBlogs.map((blog) => (
                    <div key={blog.id} className="news-card">
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
                {!hasActiveFilters && pagination.totalPages > 1 && (
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
                title="No articles found"
                description={hasActiveFilters ? "Try adjusting your search or filter" : "No articles available"}
                action={hasActiveFilters ? { label: "Clear Filters", onClick: clearFilters } : undefined}
              />
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}
