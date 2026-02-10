"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPublicCategories } from "@/store/slices/publicCategorySlice";
import { getCategoryImageUrl } from "@/utils/image";
import type { Category as CategoryType } from "@/types";

// ============================================================================
// TYPES
// ============================================================================

type MenuState = "closed" | "mobile" | "products";

interface NavItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
}

interface Category extends CategoryType {
  href: string;
  product_count?: number;
}

// ============================================================================
// DATA
// ============================================================================

const navigation: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Category", href: "/products", hasDropdown: true },
  // { name: "Products", href: "/products/all" },
  { name: "News", href: "/news" },
  { name: "Contact", href: "/contact" },
];

// ============================================================================
// COMPONENTS
// ============================================================================

const Logo = memo(() => {
  return (
    <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
      <div className="relative w-28 h-28 md:w-36 md:h-36 overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/logo.svg"
          alt="AMC Systems Logo"
          fill
          className="object-contain p-0.5 sm:p-1"
          sizes="(max-width: 475px) 40px, (max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
        />
      </div>
    </Link>
  );
});
Logo.displayName = "Logo";

// Enhanced Category Card for Mega Menu
const CategoryCard = memo(
  ({ category, onClose }: { category: Category; onClose: () => void }) => {
    const imageUrl =
      category.base_url && category.img_name
        ? getCategoryImageUrl(category.base_url, category.img_name)
        : "/placeholder.png";

    console.log("Category Data:=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", category);
    console.log("Product Count:", category.product_count);

    return (
      <Link
        href={category.href}
        onClick={onClose}
        className="group flex gap-4 p-4 rounded-xl transition-all duration-300 h-[120px]"
        style={
          {
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          } as React.CSSProperties
        }
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(29, 168, 171, 0.05)";
          e.currentTarget.style.borderColor = "rgba(29, 168, 171, 0.2)";
          e.currentTarget.style.boxShadow = "var(--shadow-glow)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-surface)";
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.boxShadow = "none";
        }}>
        {/* Category Image */}
        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="64px"
              unoptimized
            />
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-serif font-semibold transition-colors duration-300 mb-1 line-clamp-1"
            style={{ color: "var(--color-text-primary)" }}>
            {category.name}
          </h3>
          <p
            className="text-xs font-roboto line-clamp-2 mb-2"
            style={{ color: "var(--color-text-muted)" }}>
            {category.title}
          </p>
          {category.product_count !== undefined && (
            <div
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: "var(--color-primary)" }}>
              <span>{category.product_count} Products</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          )}
        </div>
      </Link>
    );
  },
);
CategoryCard.displayName = "CategoryCard";

// Simple Category List for Mobile
const CategoryList = memo(
  ({
    categories,
    onClose,
  }: {
    categories: Category[];
    onClose: () => void;
  }) => {
    return (
      <div className="space-y-1">
        {categories.slice(0, 6).map((category) => (
          <Link
            key={category.id}
            href={category.href}
            onClick={onClose}
            className="block px-4 py-2 text-sm rounded-lg transition-colors"
            style={{ color: "var(--color-navy)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-primary)";
              e.currentTarget.style.backgroundColor =
                "rgba(29, 168, 171, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-navy)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}>
            {category.name}
          </Link>
        ))}
        <Link
          href="/products"
          onClick={onClose}
          className="block px-4 py-2 text-sm font-semibold text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
          View All Softwares →
        </Link>
      </div>
    );
  },
);
CategoryList.displayName = "CategoryList";

// Desktop Mega Menu
const MegaMenu = memo(
  ({
    isOpen,
    onClose,
    categories,
  }: {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
  }) => {
    if (!isOpen) return null;

    return (
      <>
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(29, 41, 93, 0.2)" }}
          onClick={onClose}
        />
        <div className="absolute left-0 right-0 top-full mt-2 z-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    className="text-xl font-serif font-bold mb-1"
                    style={{ color: "var(--color-text-primary)" }}>
                    Browse Category
                  </h3>
                  <p
                    className="text-sm font-roboto"
                    style={{ color: "var(--color-text-muted)" }}>
                    Discover our comprehensive range of POS and IT solutions
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
                  <X
                    className="w-5 h-5"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                </button>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.slice(0, 6).map((category) => (
                  <div key={category.id}>
                    <CategoryCard category={category} onClose={onClose} />
                  </div>
                ))}
              </div>

              {/* View All Link */}
              <div className="pt-6 mt-6 border-t flex items-center gap-6">
                <Link
                  href="/products"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group"
                  style={{ color: "var(--color-primary)" }}>
                  View All Categories
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="/products/all"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group"
                  style={{ color: "var(--color-primary)" }}>
                  View All Softwares
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
MegaMenu.displayName = "MegaMenu";

// Mobile Menu
const MobileMenu = memo(
  ({
    isOpen,
    onClose,
    navigation,
    categories,
    pathname,
    onProductsToggle,
    isProductsOpen,
  }: {
    isOpen: boolean;
    onClose: () => void;
    navigation: NavItem[];
    categories: Category[];
    pathname: string;
    onProductsToggle: () => void;
    isProductsOpen: boolean;
  }) => {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "";
        };
      }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[99] lg:hidden">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        {/* Menu Panel */}
        <div className="absolute top-0 right-0 w-full h-[100svh] bg-white overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-end p-4 sm:p-6 border-b border-gray-200 bg-white">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <div
            className="flex flex-col"
            style={{ height: "calc(100svh - 70px)" }}>
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 pb-24 sm:pb-32">
              <nav className="space-y-1 sm:space-y-2">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "block px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-serif font-semibold transition-colors",
                          pathname === item.href
                            ? "text-white"
                            : "hover:bg-primary-50",
                        )}
                        style={{
                          backgroundColor:
                            pathname === item.href
                              ? "var(--color-primary)"
                              : "transparent",
                          color:
                            pathname === item.href
                              ? "white"
                              : "var(--color-text-primary)",
                        }}>
                        {item.name}
                      </Link>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "block px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-serif font-semibold transition-colors",
                          pathname === item.href
                            ? "text-white"
                            : "hover:bg-primary-50",
                        )}
                        style={{
                          backgroundColor:
                            pathname === item.href
                              ? "var(--color-primary)"
                              : "transparent",
                          color:
                            pathname === item.href
                              ? "white"
                              : "var(--color-text-primary)",
                        }}>
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* CTA Section - Fixed at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-white border-t border-gray-200">
              <Link
                href="/enquiry"
                onClick={onClose}
                className="block w-full px-4 sm:px-6 py-3 sm:py-4 text-white text-center font-serif font-semibold rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
                style={{
                  background: "var(--gradient-primary)",
                }}>
                Get a Enquiry
              </Link>
              <div
                className="flex items-center justify-center gap-2 mt-2 sm:mt-3 text-xs sm:text-sm font-roboto"
                style={{ color: "var(--color-text-muted)" }}>
                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>+971 2 345 6789</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
MobileMenu.displayName = "MobileMenu";

// ============================================================================
// MAIN HEADER
// ============================================================================

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const [menuState, setMenuState] = useState<MenuState>("closed");
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { categories: apiCategories } = useAppSelector(
    (state) => state.publicCategory,
  );

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchPublicCategories({ limit: 100 }));
  }, [dispatch]);

  // Map categories to include href
  const categories: Category[] = apiCategories.map((cat) => ({
    ...cat,
    href: `/products/${cat.slug}`,
  }));

  console.log("API Categories:", apiCategories);
  console.log("Mapped Categories:", categories);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    setIsScrolled(currentScrollY > 20);

    if (currentScrollY > lastScrollYRef.current && currentScrollY > 0) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    lastScrollYRef.current = currentScrollY;
  }, []);

  useEffect(() => {
    setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMenuState("closed");
    setIsMobileProductsOpen(false);
  }, [pathname]);

  const closeAllMenus = useCallback(() => {
    setMenuState("closed");
    setIsMobileProductsOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMenuState((prev) => (prev === "mobile" ? "closed" : "mobile"));
    setIsMobileProductsOpen(false);
  }, []);

  const toggleProductsDropdown = useCallback(() => {
    setMenuState((prev) => (prev === "products" ? "closed" : "products"));
  }, []);

  const toggleMobileProducts = useCallback(() => {
    setIsMobileProductsOpen((prev) => !prev);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
      style={{
        backgroundColor: isScrolled
          ? "rgba(255, 255, 255, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        backdropFilter: isScrolled ? "blur(16px)" : "blur(8px)",
        boxShadow: isScrolled ? "var(--shadow-glow)" : "none",
      }}>
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <button
                    onClick={toggleProductsDropdown}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-roboto font-semibold transition-colors",
                      pathname.startsWith(item.href)
                        ? "bg-primary-50"
                        : "hover:bg-primary-50",
                    )}
                    style={{
                      color: pathname.startsWith(item.href)
                        ? "var(--color-primary)"
                        : "var(--color-text-primary)",
                    }}>
                    {item.name}
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 sm:w-4 sm:h-4 transition-transform",
                        menuState === "products" && "rotate-180",
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-xs sm:text-sm font-roboto font-semibold transition-colors",
                      pathname === item.href
                        ? "bg-primary-50"
                        : "hover:bg-primary-50",
                    )}
                    style={{
                      color:
                        pathname === item.href
                          ? "var(--color-primary)"
                          : "var(--color-text-primary)",
                    }}>
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/enquiry"
              className="px-4 sm:px-6 py-2 sm:py-2.5 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              style={{
                background: "var(--color-primary-dark)",
                boxShadow: "var(--shadow-glow)",
              }}>
              Get a Enquiry
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-primary-50 transition-colors"
            style={{ color: "var(--color-text-primary)" }}>
            {menuState === "mobile" ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Mega Menu */}
      <MegaMenu
        isOpen={menuState === "products"}
        onClose={closeAllMenus}
        categories={categories}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={menuState === "mobile"}
        onClose={closeAllMenus}
        navigation={navigation}
        categories={categories}
        pathname={pathname}
        onProductsToggle={toggleMobileProducts}
        isProductsOpen={isMobileProductsOpen}
      />
    </header>
  );
}
