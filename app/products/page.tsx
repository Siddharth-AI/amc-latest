import type { Metadata } from "next";
import { getCategoriesServer } from "@/lib/server-data";
import { SITE_URL } from "@/lib/site-config";
import ProductsClient from "./ProductsClient";

// Revalidate every hour
export const revalidate = 3600;

// ============================================================================
// METADATA - PRODUCTS PAGE
// ============================================================================

export const metadata: Metadata = {
  title: "Products - POS Systems & Retail Solutions | AMC Systems",
  description:
    "Browse our comprehensive range of POS systems, retail solutions, hardware, and software. Enterprise-grade products for businesses across UAE.",
  keywords: [
    "POS systems",
    "retail solutions",
    "business hardware",
    "retail software",
    "AMC Systems products",
    "UAE business solutions",
    "point of sale systems",
    "retail management software",
  ],
  openGraph: {
    title: "Products - POS Systems & Retail Solutions | AMC Systems",
    description:
      "Comprehensive range of POS and retail solutions designed to transform your business",
    url: "/products",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AMC Systems Products",
      },
    ],
    siteName: "AMC Systems",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products - AMC Systems",
    description: "Comprehensive range of POS and retail solutions",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/products",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

// ============================================================================
// STRUCTURED DATA - PRODUCT CATALOG
// ============================================================================

function generateProductCatalogSchema(categories: any[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/products#webpage`,
    name: "AMC Systems Product Catalog",
    description:
      "Comprehensive catalog of POS systems, retail solutions, hardware, and software products",
    url: `${SITE_URL}/products`,
    mainEntity: {
      "@type": "ItemList",
      name: "Product Categories",
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "ProductGroup",
          name: category.name,
          description: category.description,
          url: `${SITE_URL}/products/${category.slug}`,
        },
      })),
    },
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "AMC Systems",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Products",
          item: `${SITE_URL}/products`,
        },
      ],
    },
  };
}

// ============================================================================
// SERVER COMPONENT
// ============================================================================

export default async function ProductsPage() {
  // No longer passing static data - client fetches from API
  return <ProductsClient />;
}
