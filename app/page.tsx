import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { CompanyIntroSection } from "@/components/home/company-intro-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { ReviewsSection } from "@/components/home/reviews-section";
import { StatsCounter } from "@/components/home/stats-counter";
import { FinalCTASection } from "@/components/home/final-cta-section";
import { SITE_URL } from "@/lib/site-config";
import { BUSINESS } from "@/lib/business";
import { generateWebPageSchema } from "@/lib/seo-schema";

// ============================================================================
// METADATA - HOME PAGE
// ============================================================================

export const metadata: Metadata = {
  title: "AMC Systems - Premium POS Solutions & Retail Systems | UAE",
  description:
    "Leading POS solutions provider in UAE since 2003. Enterprise-grade point of sale systems, retail management software, and comprehensive business solutions. Trusted by 1000+ businesses across Dubai, Abu Dhabi, and UAE.",
  keywords: [
    "POS systems UAE",
    "point of sale systems",
    "retail management software",
    "POS hardware Dubai",
    "retail solutions UAE",
    "business management systems",
    "AMC Systems",
    "Al Marwah Computers",
    "POS terminals",
    "retail technology",
    "enterprise POS solutions",
    "Dubai POS systems",
    "Abu Dhabi retail solutions",
  ],
  openGraph: {
    title: "AMC Systems - Premium POS Solutions & Retail Systems",
    description:
      "Leading POS solutions provider in UAE. Enterprise-grade point of sale systems, retail management software, and comprehensive business solutions.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AMC Systems - Premium POS Solutions Provider in UAE",
      },
    ],
    siteName: "AMC Systems - Al Marwah Computers",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "AMC Systems - Premium POS Solutions & Retail Systems",
    description:
      "Leading POS solutions provider in UAE. Enterprise-grade systems trusted by 1000+ businesses.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

// ============================================================================
// STRUCTURED DATA - HOME PAGE
// ============================================================================

function generateHomePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    name: "AMC Systems - Premium POS Solutions & Retail Systems",
    description:
      "Leading POS solutions provider in UAE. Enterprise-grade point of sale systems, retail management software, and comprehensive business solutions.",
    url: `${SITE_URL}/`,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#organization`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-image.jpg`,
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
      ],
    },
    potentialAction: [
      {
        "@type": "ContactAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/contact`,
          name: "Contact Us",
        },
      },
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
  };
}

const structuredData = generateHomePageSchema();

// ============================================================================
// HOME PAGE COMPONENT
// ============================================================================

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <main>
        <HeroSection />
        <CompanyIntroSection />
        <FeaturedCategories />
        <FeaturedProducts />
        <WhyChooseUs />
        <ReviewsSection />
        {/* <StatsCounter /> */}
        <FinalCTASection />
      </main>
    </>
  );
}
