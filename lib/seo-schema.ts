// ============================================================================
// SEO SCHEMA GENERATORS - JSON-LD structured data for SEO pages
// ============================================================================

import { BUSINESS } from "./business";

interface FAQ {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  priceRange?: string;
  image?: string;
}

// ============================================================================
// ORGANIZATION SCHEMA
// ============================================================================

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BUSINESS.url}/#organization`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    alternateName: BUSINESS.shortName,
    description: BUSINESS.tagline,
    url: BUSINESS.url,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    logo: {
      "@type": "ImageObject",
      url: `${BUSINESS.url}/logo.png`,
      width: 600,
      height: 600,
    },
    image: {
      "@type": "ImageObject",
      url: `${BUSINESS.url}/og-image.jpg`,
      width: 1200,
      height: 630,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    openingHoursSpecification: BUSINESS.openingHoursSpecification.map((spec) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: spec.dayOfWeek,
      opens: spec.opens,
      closes: spec.closes,
    })),
    sameAs: Object.values(BUSINESS.social),
    areaServed: BUSINESS.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    foundingDate: `${BUSINESS.foundingYear}-01-01`,
    knowsAbout: [
      "Point of Sale Systems",
      "Retail Management Software",
      "POS Hardware",
      "Business Solutions",
      "Enterprise Technology",
    ],
  };
}

// ============================================================================
// PRODUCT SCHEMA
// ============================================================================

export function generateProductSchema({
  name,
  description,
  url,
  price,
  currency = "AED",
  image,
  brand,
  sku,
  category,
  availability = "InStock",
}: {
  name: string;
  description: string;
  url: string;
  price?: number;
  currency?: string;
  image?: string;
  brand?: string;
  sku?: string;
  category?: string;
  availability?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name,
    description,
    image: image || `${BUSINESS.url}/og-image.jpg`,
    sku: sku || name.toLowerCase().replace(/\s+/g, "-"),
    brand: {
      "@type": "Brand",
      name: brand || BUSINESS.name,
    },
    category: category || "POS Systems",
    manufacturer: {
      "@type": "Organization",
      name: BUSINESS.name,
    },
    offers: price
      ? {
          "@type": "Offer",
          url,
          priceCurrency: currency,
          price: price.toString(),
          priceValidUntil: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString().split("T")[0],
          availability: `https://schema.org/${availability}`,
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: BUSINESS.name,
            url: BUSINESS.url,
          },
        }
      : undefined,
  };
}

// ============================================================================
// SERVICE SCHEMA
// ============================================================================

export function generateServiceSchema({
  name,
  description,
  url,
  priceRange,
  image,
}: ServiceSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      "@id": `${BUSINESS.url}/#organization`,
      name: BUSINESS.name,
    },
    areaServed: {
      "@type": "City",
      name: BUSINESS.address.city,
    },
    ...(priceRange && { priceRange }),
    ...(image && { image }),
  };
}

// ============================================================================
// FAQ SCHEMA
// ============================================================================

export function generateFAQSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ============================================================================
// BREADCRUMB SCHEMA
// ============================================================================

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BUSINESS.url,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: item.url,
      })),
    ],
  };
}

// ============================================================================
// WEBPAGE SCHEMA
// ============================================================================

export function generateWebPageSchema({
  title,
  description,
  url,
  breadcrumbs,
}: {
  title: string;
  description: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: title,
    description,
    url,
    isPartOf: {
      "@id": `${BUSINESS.url}/#website`,
    },
    about: {
      "@id": `${BUSINESS.url}/#organization`,
    },
    ...(breadcrumbs && {
      breadcrumb: generateBreadcrumbSchema(breadcrumbs),
    }),
  };
}

// ============================================================================
// ARTICLE SCHEMA (for News/Blog)
// ============================================================================

export function generateArticleSchema({
  title,
  description,
  url,
  author,
  publishDate,
  image,
  category,
}: {
  title: string;
  description: string;
  url: string;
  author: string;
  publishDate: string;
  image?: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: title,
    description,
    url,
    image: image || `${BUSINESS.url}/og-image.jpg`,
    datePublished: publishDate,
    dateModified: publishDate,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BUSINESS.url}/#organization`,
      name: BUSINESS.name,
      logo: {
        "@type": "ImageObject",
        url: `${BUSINESS.url}/logo.png`,
      },
    },
    ...(category && { articleSection: category }),
  };
}

// ============================================================================
// WEBSITE SCHEMA
// ============================================================================

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BUSINESS.url}/#website`,
    name: BUSINESS.name,
    url: BUSINESS.url,
    description: BUSINESS.tagline,
    publisher: {
      "@id": `${BUSINESS.url}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BUSINESS.url}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

