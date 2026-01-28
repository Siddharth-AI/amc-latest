import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Insights - AMC Systems | Latest Updates",
  description:
    "Stay updated with our latest product launches, industry insights, and company news from AMC Systems. Get the latest trends in POS and retail technology.",
  keywords: [
    "AMC Systems news",
    "POS systems updates",
    "retail technology news",
    "business insights",
    "industry news UAE",
  ],
  openGraph: {
    title: "News & Insights - AMC Systems",
    description:
      "Stay updated with our latest product launches, industry insights, and company news",
    url: "/news",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AMC Systems News",
      },
    ],
    siteName: "AMC Systems",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "News & Insights - AMC Systems",
    description: "Latest updates and insights from AMC Systems",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/news",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

