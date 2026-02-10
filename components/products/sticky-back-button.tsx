"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface StickyBackButtonProps {
  backHref: string;
  backLabel: string;
  productCount?: number;
}

export function StickyBackButton({
  backHref,
  backLabel,
  productCount,
}: StickyBackButtonProps) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Header hides when scrolling down, shows when scrolling up
    if (currentScrollY > lastScrollYRef.current && currentScrollY > 20) {
      setIsHeaderVisible(false);
    } else {
      setIsHeaderVisible(true);
    }

    lastScrollYRef.current = currentScrollY;
  }, []);

  useEffect(() => {
    setIsHeaderVisible(window.scrollY <= 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      className={cn(
        "sticky z-[1000] bg-white border-b border-slate-200 shadow-sm transition-all duration-300",
        isHeaderVisible ? "top-16" : "top-0",
      )}>
      <Container>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <Link
              href={backHref || "/products"}
              prefetch={true}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-navy-900 hover:text-primary-600 transition-colors group touch-manipulation relative z-[100] pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
              }}>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors pointer-events-none">
                <ArrowLeft className="w-4 h-4 text-navy-900 group-hover:text-primary-600 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="pointer-events-none font-bold">{backLabel}</span>
            </Link>

            {/* Product Count */}
            {productCount !== undefined && (
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Package className="w-4 h-4 text-slate-600" />
                <span className="font-bold text-navy-900">
                  {productCount} Softwares
                </span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
