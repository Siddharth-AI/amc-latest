import type { Metadata } from "next";
import { CategoryPageClient } from "./category-page-client";
import { SITE_URL } from "@/lib/site-config";
import { generateWebPageSchema } from "@/lib/seo-schema";

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const categoryUrl = `${SITE_URL}/products/${categorySlug}`;

  return {
    title: `${categorySlug} - POS Systems & Solutions | AMC Systems`,
    description: `Browse our comprehensive range of ${categorySlug} products. Enterprise-grade solutions for your business needs.`,
    alternates: { canonical: categoryUrl },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const categoryUrl = `${SITE_URL}/products/${categorySlug}`;
  const breadcrumbs = [
    { name: "Softwares", url: `${SITE_URL}/products` },
    { name: categorySlug, url: categoryUrl },
  ];

  const structuredData = generateWebPageSchema({
    title: `${categorySlug} - AMC Systems`,
    description: `Browse ${categorySlug} products`,
    url: categoryUrl,
    breadcrumbs,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <CategoryPageClient categorySlug={categorySlug} />
      </main>
    </>
  );
}
