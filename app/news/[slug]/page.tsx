"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogDetailSkeleton } from "@/components/news/blog-detail-skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import { StickyBackButton } from "@/components/news/sticky-back-button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPublicBlogBySlug,
  clearSelectedBlog,
} from "@/store/slices/publicBlogSlice";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useAppDispatch();
  const { selectedBlog, loading, error } = useAppSelector(
    (state) => state.publicBlog
  );

  useEffect(() => {
    if (slug) {
      dispatch(fetchPublicBlogBySlug(slug));
    }
    return () => {
      dispatch(clearSelectedBlog());
    };
  }, [dispatch, slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const imageUrl =
    selectedBlog?.base_url && selectedBlog?.img_name
      ? `${selectedBlog.base_url}${selectedBlog.img_name}`
      : "/placeholder.png";

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (error || !selectedBlog) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <Container>
          <div className="max-w-4xl mx-auto px-4 py-12">
            <ErrorMessage
              message={error || "Blog not found"}
              onRetry={() => dispatch(fetchPublicBlogBySlug(slug))}
            />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StickyBackButton />

      <Section className="relative pt-8 sm:pt-12 pb-0 overflow-hidden">
        <Container>
          <div className="max-w-5xl mx-auto px-4">
            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
              <div className="mb-4 sm:mb-6 mt-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {selectedBlog.tags[0].name}
                  </span>
                </div>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-navy-900 mb-6 sm:mb-8 leading-[1.1] max-w-4xl">
              {selectedBlog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center ring-2 ring-primary-100">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-900">Admin</p>
                  <p className="text-xs text-slate-500">Author</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(selectedBlog.created_at)}</span>
              </div>
            </div>

            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 mb-12 sm:mb-16">
              <Image
                src={imageUrl}
                alt={selectedBlog.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="object-cover"
                priority
                quality={95}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/20 to-transparent" />
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-0 sm:py-8">
        <Container>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-[1fr_280px] gap-12">
              <div className="min-w-0">
                <div className="prose prose-lg prose-slate max-w-none">
                  <div
                    className="text-base sm:text-lg text-slate-700 leading-relaxed space-y-6"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: selectedBlog.description
                        .replace(/<\/p>/g, "</p><br/>")
                        .replace(
                          /<pre>/g,
                          '<pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0;">'
                        )
                        .replace(
                          /<code>/g,
                          '<code style="background: #e5e7eb; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">'
                        )
                        .replace(
                          /<blockquote>/g,
                          '<blockquote style="border-left: 4px solid #d1d5db; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #6b7280;">'
                        )
                        .replace(
                          /<hr>/g,
                          '<hr style="margin: 1.5rem 0; border-color: #d1d5db;"/>'
                        ),
                    }}
                  />
                </div>

                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        Tags:
                      </span>
                      {selectedBlog.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="default"
                          className="text-sm">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Share2 className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy-900">
                          Share this article
                        </p>
                        <p className="text-xs text-slate-500">
                          Help others discover this content
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          `https://amcsystems.ae/news/${slug}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg hover:shadow-xl"
                        aria-label="Share on Facebook">
                        <Facebook className="w-5 h-5" />
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          `https://amcsystems.ae/news/${slug}`
                        )}&text=${encodeURIComponent(selectedBlog.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg hover:shadow-xl"
                        aria-label="Share on Twitter">
                        <Twitter className="w-5 h-5" />
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          `https://amcsystems.ae/news/${slug}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg hover:shadow-xl"
                        aria-label="Share on LinkedIn">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-32 space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-900 to-slate-900 text-white">
                    <h3 className="text-lg font-bold mb-2 text-white">
                      Stay Updated
                    </h3>
                    <p className="text-sm text-slate-300 mb-4">
                      Get the latest insights delivered to your inbox
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold"
                      asChild>
                      <Link href="/contact">Subscribe Now</Link>
                    </Button>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <h3 className="text-sm font-bold text-navy-900 mb-4">
                      Quick Links
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="/about"
                        className="block text-sm text-slate-600 hover:text-primary-600 transition-colors">
                        About AMC Systems
                      </Link>
                      <Link
                        href="/products"
                        className="block text-sm text-slate-600 hover:text-primary-600 transition-colors">
                        Our Products
                      </Link>
                      <Link
                        href="/contact"
                        className="block text-sm text-slate-600 hover:text-primary-600 transition-colors">
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-12 sm:py-16 bg-gradient-to-br from-navy-900 via-slate-900 to-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss an update on the latest
              trends and innovations
            </p>
            <Button
              size="lg"
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 rounded-xl font-bold hover:scale-105 transition-all shadow-xl"
              asChild>
              <Link href="/contact">
                Subscribe Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
