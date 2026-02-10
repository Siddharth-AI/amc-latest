"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShoppingBag,
  Store,
  Laptop,
  Headphones,
  Package,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const categories = [
  {
    name: "POS Systems",
    icon: ShoppingBag,
    productCount: 12,
    href: "/products/pos-systems",
    description: "Complete point of sale solutions for modern retail",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    color: "from-primary-400 via-primary-500 to-primary-600",
    bgColor: "bg-primary-50",
    iconColor: "text-primary-600",
    trending: true,
  },
  {
    name: "Retail Solutions",
    icon: Store,
    productCount: 8,
    href: "/products/retail-solutions",
    description: "Comprehensive retail technology and management",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    color: "from-navy-400 via-navy-500 to-navy-600",
    bgColor: "bg-navy-50",
    iconColor: "text-navy-600",
    trending: false,
  },
  {
    name: "Software",
    icon: Laptop,
    productCount: 15,
    href: "/products/software",
    description: "Business management and inventory software",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    color: "from-emerald-400 via-teal-500 to-cyan-600",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600",
    trending: true,
  },
  {
    name: "Hardware",
    icon: Package,
    productCount: 20,
    href: "/products/hardware",
    description: "Quality hardware components and peripherals",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
    color: "from-brown-300 via-brown-400 to-brown-500",
    bgColor: "bg-brown-50",
    iconColor: "text-brown-600",
    trending: false,
  },
  {
    name: "Support Services",
    icon: Headphones,
    productCount: 5,
    href: "/products/support-services",
    description: "24/7 technical support and maintenance",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",
    color: "from-rose-400 via-pink-500 to-fuchsia-600",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
    trending: false,
  },
  {
    name: "Custom Solutions",
    icon: Settings,
    productCount: 10,
    href: "/products/custom-solutions",
    description: "Tailored business solutions for your needs",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    color: "from-amber-400 via-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    trending: true,
  },
];

export function FeaturedCategories() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-primary-200/30 rounded-full blur-2xl sm:blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-navy-200/30 rounded-full blur-2xl sm:blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-brown-200/20 rounded-full blur-2xl sm:blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f010_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f010_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem]" />

        {/* Gradient Overlay */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/5 via-transparent to-transparent" />
      </div>

      <Container className="relative z-10">
        {/* Premium Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-24 space-y-4 sm:space-y-6">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-strong border border-primary/20 text-xs sm:text-sm font-semibold text-primary mb-3 sm:mb-4 shadow-lg hover:shadow-glow transition-all duration-300 group">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform" />
            <span>Explore Our Software Categories</span>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
          </div>

          {/* Main Heading with Gradient */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-navy-500 leading-tight">
              Discover The{" "}
              <span className="relative inline-block">
                <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-navy-500 to-brown-500">
                  Perfect
                </span>
                <svg
                  className="absolute -bottom-1 sm:-bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 300 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 6C50 3 100 1 150 3C200 5 250 3 298 6"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
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
              Solution For Your Business
            </h2>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-text-muted max-w-3xl mx-auto leading-relaxed">
              Comprehensive range of POS and retail solutions designed to{" "}
              <span className="text-primary-600 font-semibold">
                transform your business
              </span>{" "}
              operations and drive growth
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-6 sm:pt-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-navy-500">
                60+
              </div>
              <div className="text-xs sm:text-sm text-text-muted">
                Softwares
              </div>
            </div>
            <div className="w-px h-8 sm:h-10 md:h-12 bg-border" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-navy-500">
                6
              </div>
              <div className="text-xs sm:text-sm text-text-muted">
                Categories
              </div>
            </div>
            <div className="w-px h-8 sm:h-10 md:h-12 bg-border" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-navy-500">
                24/7
              </div>
              <div className="text-xs sm:text-sm text-text-muted">Support</div>
            </div>
          </div>
        </div>

        {/* Premium Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isHovered = hoveredIndex === index;

            return (
              <Link
                key={category.name}
                href={category.href}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative">
                {/* Glow Effect on Hover */}
                {isHovered && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-navy-400 to-brown-400  blur-xl opacity-50 animate-pulse" />
                )}

                {/* Card Container */}
                <div className="relative h-full overflow-hidden bg-white border border-border/50 shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-primary/30 hover:-translate-y-2 rounded-xl sm:rounded-2xl lg:rounded-3xl">
                  {/* Image Section with Overlay */}
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    {/* Image */}
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-70 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-60`}
                    />

                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-100 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Trending Badge */}
                    {category.trending && (
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                        <Badge className="bg-white/95 text-navy-600 font-bold shadow-lg backdrop-blur-sm border border-white/50 flex items-center gap-1.5 px-2 sm:px-3 py-1 text-xs">
                          <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary-600" />
                          <span>Trending</span>
                        </Badge>
                      </div>
                    )}

                    {/* Product Count Badge */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <Badge className="bg-white/90 backdrop-blur-md text-navy-600 font-bold shadow-lg border border-white/30 px-2 sm:px-3 py-1 text-xs">
                        {category.productCount} Softwares
                      </Badge>
                    </div>

                    {/* Icon Circle */}
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${category.bgColor} backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                        <Icon
                          className={`h-6 w-6 sm:h-8 sm:w-8 ${category.iconColor}`}
                        />
                      </div>
                    </div>

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-white to-gray-50/50">
                    {/* Category Name */}
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-navy-500 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                        {category.description}
                      </p>
                    </div>

                    {/* CTA with Arrow */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs sm:text-sm font-bold text-primary-600 group-hover:text-primary-700 transition-colors">
                        View Collection
                      </span>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-600 transition-all duration-300 group-hover:shadow-lg">
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>

                    {/* Bottom Accent Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Corner Decoration */}
                  <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden">
                    <div
                      className={`absolute -top-8 -right-8 sm:-top-10 sm:-right-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${category.color} opacity-20 rounded-full group-hover:scale-150 transition-transform duration-500`}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass-strong border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow group cursor-pointer">
            <span className="text-navy-600 font-semibold">
              Can't find what you're looking for?
            </span>
            <Link
              href="/contact"
              className="text-primary-600 font-bold hover:text-primary-700 transition-colors flex items-center gap-2">
              Contact Us
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
