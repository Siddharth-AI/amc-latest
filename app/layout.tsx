import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ReduxProvider } from "@/store/provider";
import { SITE_URL } from "@/lib/site-config";
import { BUSINESS } from "@/lib/business";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo-schema";

// ============================================================================
// ADVANCED SEO METADATA CONFIGURATION
// ============================================================================

export const metadata: Metadata = {
  // metadataBase resolves relative URLs in metadata
  metadataBase: new URL(SITE_URL),

  // ===== BASIC METADATA =====
  title: {
    default: "AMC Systems - Premium POS Solutions & Retail Systems | UAE",
    template: "%s | AMC Systems",
  },
  description:
    "Leading POS solutions provider in UAE since 2003. Enterprise-grade point of sale systems, retail management software, and comprehensive business solutions. Trusted by 1000+ businesses.",
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
  ],
  authors: [{ name: "AMC Systems - Al Marwah Computers" }],
  creator: "AMC Systems",
  publisher: "AMC Systems",

  // ===== ROBOTS & INDEXING =====
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ===== OPEN GRAPH (Facebook, LinkedIn, etc.) =====
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "/",
    siteName: "AMC Systems - Al Marwah Computers",
    title: "AMC Systems - Premium POS Solutions & Retail Systems",
    description:
      "Leading POS solutions provider in UAE. Enterprise-grade point of sale systems, retail management software, and comprehensive business solutions.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AMC Systems - Premium POS Solutions Provider in UAE",
        type: "image/jpeg",
      },
    ],
  },

  // ===== TWITTER / X CARD =====
  twitter: {
    card: "summary_large_image",
    site: "@amcsystems",
    creator: "@amcsystems",
    title: "AMC Systems - Premium POS Solutions & Retail Systems",
    description:
      "Leading POS solutions provider in UAE. Enterprise-grade systems trusted by 1000+ businesses.",
    images: ["/og-image.jpg"],
  },

  // ===== CANONICAL & ALTERNATES =====
  alternates: {
    canonical: "/",
  },

  // ===== VERIFICATION TAGS =====
  verification: {
    google: "", // Add your Google Search Console verification code
    // yandex: '',  // Add Yandex Webmaster verification code
    // bing: '',    // Add Bing Webmaster verification code
  },

  // ===== APP & MANIFEST =====
  applicationName: "AMC Systems",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AMC Systems",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  // ===== CATEGORY & CLASSIFICATION =====
  category: "Technology & Business Solutions",
};

// ===== VIEWPORT CONFIGURATION =====
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ============================================================================
// ROOT LAYOUT COMPONENT
// ============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ===== STRUCTURED DATA (JSON-LD) =====
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  // Enhanced Organization Schema with more details
  const enhancedOrganizationSchema = {
    ...organizationSchema,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "POS Solutions & Retail Systems",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "POS Systems",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "POS Hardware" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "POS Software" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "POS Terminals" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Retail Solutions",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Retail Management Software" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Inventory Management" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Solutions" } },
          ],
        },
      ],
    },
    potentialAction: [
      {
        "@type": "ContactAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/contact`,
          actionPlatform: [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform",
          ],
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ===== JSON-LD STRUCTURED DATA ===== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(enhancedOrganizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* ===== ADDITIONAL META TAGS ===== */}
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="format-detection" content="address=yes" />
        <meta name="format-detection" content="email=yes" />

        {/* ===== LANGUAGE & REGION ===== */}
        <meta httpEquiv="content-language" content="en-AE" />

        {/* ===== PRECONNECT FOR PERFORMANCE ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* ===== FAVICON ===== */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body className="font-sans">
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}>
            <PublicLayout>{children}</PublicLayout>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
