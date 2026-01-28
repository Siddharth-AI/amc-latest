"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Star,
  Zap,
  TrendingUp,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

// --- Types ---
type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categorySlug: string;
  shortDescription: string;
  price: number;
  currency: string;
  images: string[];
  rating: number;
  reviews: number;
  tag?: string;
};

// --- Data ---
const FEATURED_PRODUCTS_DATA: Product[] = [
  {
    id: "pos-terminal-advanced",
    name: "Advanced POS Terminal X1",
    slug: "pos-terminal-advanced",
    brand: "Premium",
    categorySlug: "pos-systems",
    shortDescription:
      "Ultra-fast touch terminal with integrated thermal printer",
    price: 2499,
    currency: "AED",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    ],
    rating: 4.9,
    reviews: 124,
    tag: "Best Seller",
  },
  {
    id: "retail-management-pro",
    name: "Retail Pro Suite 2025",
    slug: "retail-management-pro",
    brand: "Enterprise",
    categorySlug: "retail-solutions",
    shortDescription: "All-in-one inventory & sales management ecosystem",
    price: 4999,
    currency: "AED",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    ],
    rating: 4.8,
    reviews: 89,
    tag: "Trending",
  },
  {
    id: "mobile-pos-tablet",
    name: "Mobile Go Tablet POS",
    slug: "mobile-pos-tablet",
    brand: "Mobile",
    categorySlug: "pos-systems",
    shortDescription: "Portable 5G-ready POS for business on the move",
    price: 1299,
    currency: "AED",
    images: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    ],
    rating: 4.7,
    reviews: 156,
    tag: "New",
  },
  {
    id: "inventory-software",
    name: "StockMaster AI",
    slug: "inventory-software",
    brand: "Software",
    categorySlug: "software",
    shortDescription: "AI-powered inventory prediction & tracking",
    price: 899,
    currency: "AED",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    ],
    rating: 4.9,
    reviews: 201,
    tag: "Popular",
  },
  {
    id: "payment-gateway",
    name: "SecurePay Gateway",
    slug: "payment-gateway",
    brand: "Payment",
    categorySlug: "hardware",
    shortDescription: "Military-grade encryption for all card payments",
    price: 599,
    currency: "AED",
    images: [
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80",
    ],
    rating: 4.8,
    reviews: 178,
  },
];

function formatPrice(value: number, currency: string) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function FeaturedProducts() {
  const products = useMemo(() => FEATURED_PRODUCTS_DATA, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  return (
    <Section className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-white">
      {/* --- Premium Background Effects --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Gradients */}
        <div className="absolute -top-[20%] right-[10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] bg-primary-100/40 rounded-full blur-[60px] sm:blur-[80px] md:blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute top-[40%] -left-[10%] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] bg-navy-100/40 rounded-full blur-[50px] sm:blur-[70px] md:blur-[100px] mix-blend-multiply" />

        {/* Modern Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_16px] sm:bg-[size:20px_20px] md:bg-[size:24px_24px]" />
      </div>

      <Container className="relative z-10">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-50/50 border border-primary/20 text-xs sm:text-sm font-bold text-primary-700 backdrop-blur-md">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 fill-primary-700" />
              <span>Performance Hardware</span>
            </div>

            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-navy-900 tracking-tight leading-[1.1]">
              Engineered for{" "}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-navy-600">
                Growth
                {/* Underline svg */}
                <svg
                  className="absolute w-full h-2 sm:h-3 -bottom-1 sm:-bottom-2 left-0 text-primary-400"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none">
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-slate-500 leading-relaxed font-light">
              Upgrade your business infrastructure with our premium selection of
              POS terminals and enterprise software.
            </p>
          </div>

          {/* --- Desktop Navigation Buttons --- */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={scrollPrev}
              disabled={!canPrev}
              className="w-14 h-14 rounded-full border border-slate-200 bg-white flex items-center justify-center text-navy-700 transition-all duration-300 hover:bg-navy-900 hover:text-white hover:border-navy-900 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-navy-700 shadow-sm">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canNext}
              className="w-14 h-14 rounded-full border border-slate-200 bg-white flex items-center justify-center text-navy-700 transition-all duration-300 hover:bg-navy-900 hover:text-white hover:border-navy-900 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-navy-700 shadow-sm">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* --- Carousel Track --- */}
        <div className="relative" ref={emblaRef}>
          <div className="flex -ml-6">
            {/* Added pt-10 for hover lift space */}
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] xl:flex-[0_0_25%] pl-6 min-w-0">
                <Link
                  href={`/products/${product.categorySlug}/${product.slug}`}
                  className="group block h-full relative">
                  {/* Card Container */}
                  <div className="relative h-full bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-md sm:shadow-lg transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-primary/20 overflow-visible z-10">
                    {/* Floating Badge */}
                    <div className="absolute -top-2 sm:-top-4 left-3 sm:left-6 z-20 flex gap-1 sm:gap-2">
                      <span className="px-2 sm:px-4 py-1 sm:py-1.5 rounded-full bg-navy-900 text-white text-xs font-bold shadow-lg tracking-wide uppercase">
                        {product.brand}
                      </span>
                      {product.tag && (
                        <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white text-primary-600 border border-primary-100 text-xs font-bold shadow-sm flex items-center gap-1">
                          {product.tag === "Trending" && (
                            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          )}
                          {product.tag}
                        </span>
                      )}
                    </div>

                    {/* Image Section */}
                    <div className="relative h-40 sm:h-48 md:h-56 w-full rounded-t-xl sm:rounded-t-2xl overflow-hidden bg-slate-50 group-hover:bg-primary-50/30 transition-colors duration-500">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {/* Inner Glow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Content Section */}
                    <div className="p-3 sm:p-4 md:p-6">
                      {/* Rating */}
                      <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                        <span className="text-xs sm:text-sm font-bold text-navy-900">
                          {product.rating}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-400">
                          ({product.reviews})
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-navy-900 mb-1 sm:mb-2 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-3 sm:mb-4 h-8 sm:h-10">
                        {product.shortDescription}
                      </p>

                      {/* Divider */}
                      <div className="h-px w-full bg-slate-100 mb-3 sm:mb-4 group-hover:bg-primary-100 transition-colors" />

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                            Price
                          </p>
                          <p className="text-sm sm:text-base md:text-lg font-black text-navy-900">
                            {formatPrice(product.price, product.currency)}
                          </p>
                        </div>

                        {/* Circular Action Button */}
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 transition-all duration-300 group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-lg shadow-sm">
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Backdrop Glow (Only visible on hover) */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-navy-400 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* --- Advanced Bottom Indicator --- */}
        <div className="mt-4 flex flex-col items-center justify-center gap-6">
          {/* Progress Bar Style Indicators */}
          {/* <div className="flex items-center gap-2 p-2 rounded-full bg-slate-50 border border-slate-100 shadow-inner">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`
                  relative h-2 rounded-full transition-all duration-500 ease-out
                  ${
                    index === selectedIndex
                      ? "w-12 bg-primary-500 shadow-md"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div> */}

          {/* Mobile Only: View All Button */}
          <div className="md:hidden w-full px-4">
            <Link href="/products" className="block w-full">
              <Button className="w-full rounded-xl py-6 font-bold text-lg shadow-lg shadow-primary/20">
                Explore All Products
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
