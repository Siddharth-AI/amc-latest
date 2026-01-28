"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Award,
  Building2,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "Ahmed Al Mansoori",
    role: "CEO, Retail Chain",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    rating: 5,
    text: "Working with AMC Systems for over 10 years has been transformational. Their decades of experience shine through in every solution they deliver.",
    company: "Dubai Retail Group",
    projects: "50+ Locations",
  },
  {
    name: "Sarah Johnson",
    role: "Operations Director",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    rating: 5,
    text: "The depth of knowledge from 20+ years in the industry is invaluable. They've seen it all and know exactly what works.",
    company: "Tech Solutions LLC",
    projects: "Enterprise Deployment",
  },
  {
    name: "Mohammed Hassan",
    role: "Store Manager",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    rating: 5,
    text: "Best POS provider in UAE. Their 20+ years of experience translates into reliable, battle-tested solutions.",
    company: "SuperMart UAE",
    projects: "200+ Terminals",
  },
  {
    name: "Fatima Ali",
    role: "Business Owner",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    rating: 5,
    text: "AMC helped us scale from 1 store to 15 locations. Their experience makes all the difference.",
    company: "Fashion Hub",
    projects: "15 Store Rollout",
  },
];

export function ReviewsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
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
      {/* Premium Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-navy-100/40 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <Container className="relative z-10">
        {/* Header - Same Style as Featured Products & Why Choose Us */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50/50 border border-primary/20 text-sm font-bold text-primary-700 backdrop-blur-md">
              <Sparkles className="h-4 w-4 fill-primary-700" />
              <span>Client Success Stories</span>
            </div>

            {/* Main Heading with Gradient & Underline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-navy-900 leading-[1.1] tracking-tight">
              Trusted by{" "}
              <span className="relative inline-block">
                <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-navy-500 to-brown-500">
                  Businesses
                </span>
                {/* SVG Underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none">
                  <path
                    d="M2 10C50 5 100 2 150 5C200 8 250 5 298 10"
                    stroke="url(#gradient-reviews)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient-reviews"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%">
                      <stop offset="0%" stopColor="#1DA8AB" />
                      <stop offset="50%" stopColor="#1D295D" />
                      <stop offset="100%" stopColor="#4B2A17" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />
              Across the UAE
            </h2>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-light">
              Four decades of excellence delivering proven results. Real success
              stories from businesses we've empowered.
            </p>
          </div>

          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-navy-600 hover:bg-primary-50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-40">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-navy-600 hover:bg-primary-50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-40">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden pb-12" ref={emblaRef}>
            <div className="flex gap-6 md:gap-8">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0">
                  <div className="h-full bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-100 p-6 sm:p-8 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4 sm:mb-6">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-base sm:text-lg text-slate-700 mb-4 sm:mb-6 leading-relaxed">
                      "{review.text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-100">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden ring-2 ring-slate-100">
                        <Image
                          src={review.avatar}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-navy-900 text-sm sm:text-base">
                          {review.name}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600">
                          {review.role}
                        </div>
                        <div className="text-xs sm:text-sm text-primary-600 font-semibold">
                          {review.company}
                        </div>
                      </div>
                    </div>

                    {/* Project Badge */}
                    <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary-50 text-xs font-bold text-primary-700">
                      <Building2 className="h-3 w-3" />
                      {review.projects}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-16">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-500 ease-out",
                index === selectedIndex
                  ? "w-12 bg-primary-500 shadow-md"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              )}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats Bar - 40 Years Highlight */}
        <div className="pt-12 sm:pt-16 border-t-2 border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="group">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 mb-2 group-hover:scale-110 transition-transform">
                20+
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-600">
                Years Experience
              </div>
            </div>
            <div className="group">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-navy-600 mb-2 group-hover:scale-110 transition-transform">
                15K+
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-600">
                Installations
              </div>
            </div>
            <div className="group">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-navy-600 mb-2 group-hover:scale-110 transition-transform">
                98%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-600">
                Client Retention
              </div>
            </div>
            <div className="group">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-navy-600 mb-2 group-hover:scale-110 transition-transform">
                1000+
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-600">
                Happy Clients
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
