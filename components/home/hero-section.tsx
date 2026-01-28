"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  image: string;
  cta: {
    primary: { text: string; href: string };
    secondary: { text: string; href: string };
  };
  stats?: { value: string; label: string; icon: any }[];
}

const heroSlides: HeroSlide[] = [
  {
    id: "pos-solutions",
    badge: "#1 POS Solutions in UAE • Since 2003",
    title: "Transform Your Business with",
    titleHighlight: "Smart POS Solutions",
    subtitle:
      "Enterprise-grade technology trusted by 1000+ businesses. From retail to hospitality, we power your digital transformation.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80&auto=format&fit=crop",
    cta: {
      primary: { text: "Explore Products", href: "/products" },
      secondary: { text: "Get Free Quote", href: "/contact" },
    },
    // stats: [
    //   { value: "20+", label: "Years Experience", icon: Award },
    //   { value: "1000+", label: "Happy Clients", icon: Users },
    //   { value: "99.9%", label: "Uptime", icon: TrendingUp },
    // ],
  },
  {
    id: "casio-ecr",
    badge: "Premium ECR Solutions",
    title: "CASIO & Sharp",
    titleHighlight: "Electronic Cash Registers",
    subtitle:
      "Premium ECR solutions with advanced features. Leading brands with comprehensive support and training.",
    image:
      "https://images.unsplash.com/photo-1556740772-1a741367b93e?w=1920&q=80&auto=format&fit=crop",
    cta: {
      primary: {
        text: "View ECR Products",
        href: "/products/ecr-electronic-cash-register",
      },
      secondary: { text: "Request Demo", href: "/contact" },
    },
  },
  {
    id: "complete-solutions",
    badge: "End-to-End Solutions",
    title: "Complete Business",
    titleHighlight: "Automation Suite",
    subtitle:
      "Integrated software and hardware solutions for seamless operations. Everything your business needs in one place.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80&auto=format&fit=crop",
    cta: {
      primary: { text: "Explore Solutions", href: "/products" },
      secondary: { text: "Learn More", href: "/about" },
    },
  },
  {
    id: "expert-support",
    badge: "24/7 Dedicated Support",
    title: "Expert Support",
    titleHighlight: "& Maintenance",
    subtitle:
      "Round-the-clock technical support and maintenance. Our service excellence brings customers back.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1920&q=80&auto=format&fit=crop",
    cta: {
      primary: { text: "Contact Support", href: "/contact" },
      secondary: { text: "View Services", href: "/about" },
    },
  },
];

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  return (
    <section className="relative h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-[100vh] min-h-[500px] sm:min-h-[600px] w-full overflow-hidden">
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {heroSlides.map((slide, index) => (
            <div key={slide.id} className="relative flex-[0_0_100%] h-full">
              {/* Background with Vignette */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  quality={90}
                  className="object-cover"
                  style={{
                    filter: "brightness(0.4) contrast(1.1)",
                  }}
                  sizes="100vw"
                />
                {/* Vignette Effect */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.6) 100%)
                    `,
                    opacity: 0.7,
                  }}
                />
                {/* Gradient Overlays */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(to right, rgba(29, 41, 93, 0.1) 0%, rgba(29, 41, 93, 0.1) 50%, rgba(29, 168, 171, 0.1) 80%),
                      linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 10%)
                    `,
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 max-w-7xl">
                  <div className="max-w-4xl">
                    <div
                      ref={contentRef}
                      className="space-y-4 sm:space-y-6 md:space-y-8 text-white">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 px-3 mt-8 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 bg-brown-400/10">
                        <span className="text-xs sm:text-sm font-medium">
                          {slide.badge}
                        </span>
                      </div>

                      {/* Headline */}
                      <div className="space-y-2 sm:space-y-4">
                        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-tight tracking-tight text-brown-400">
                          {slide.title}
                          {slide.titleHighlight && (
                            <>
                              <br />
                              <span className="inline-block text-navy-300 mt-1 sm:mt-2">
                                {slide.titleHighlight}
                              </span>
                            </>
                          )}
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl leading-relaxed font-roboto">
                          {slide.subtitle}
                        </p>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 md:gap-4">
                        <Link
                          href={slide.cta.primary.href}
                          className="group inline-flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-glow hover:scale-105 bg-primary-600 text-sm sm:text-base">
                          {slide.cta.primary.text}
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                        <Link
                          href={slide.cta.secondary.href}
                          className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-105 rounded-lg sm:rounded-xl bg-brown-500/30 text-white text-sm sm:text-base">
                          {slide.cta.secondary.text}
                        </Link>
                      </div>

                      {/* Stats */}
                      {slide.stats && (
                        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 md:pt-8 border-t border-white/20 max-w-2xl">
                          {slide.stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                              <div
                                key={stat.label}
                                className="space-y-1 sm:space-y-2">
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <Icon
                                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                                    style={{ color: "var(--color-primary)" }}
                                  />
                                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                                    {stat.value}
                                  </div>
                                </div>
                                <div className="text-xs sm:text-sm text-white/70">
                                  {stat.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center">
            {/* Slide Indicators */}
            <div className="flex items-center gap-1 sm:gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "h-1.5 sm:h-2 rounded-full transition-all duration-300",
                    index === selectedIndex
                      ? "w-8 sm:w-12 bg-primary-500"
                      : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
