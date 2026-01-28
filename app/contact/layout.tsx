import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - AMC Systems | Get in Touch",
  description:
    "Contact AMC Systems for premium POS solutions in UAE. Get expert advice, support, and customized business solutions. Reach out to our team today.",
  keywords: [
    "contact AMC Systems",
    "POS systems contact",
    "UAE business support",
    "AMC Systems phone",
    "retail solutions contact",
  ],
  openGraph: {
    title: "Contact Us - AMC Systems",
    description:
      "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    url: "/contact",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact AMC Systems",
      },
    ],
    siteName: "AMC Systems",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - AMC Systems",
    description: "Get in touch with AMC Systems",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

