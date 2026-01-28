import type { Metadata } from "next";
import { ProductDetailClient } from "./product-detail-client";
import { SITE_URL } from "@/lib/site-config";
import { generateWebPageSchema } from "@/lib/seo-schema";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  const productUrl = `${SITE_URL}/products/${categorySlug}/${productSlug}`;

  return {
    title: `${productSlug} | AMC Systems`,
    description: `Shop ${productSlug}. Premium POS and retail solution available at AMC Systems, UAE.`,
    alternates: { canonical: productUrl },
    robots: { index: true, follow: true },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { categorySlug, productSlug } = await params;
  const productUrl = `${SITE_URL}/products/${categorySlug}/${productSlug}`;
  const breadcrumbs = [
    { name: "Products", url: `${SITE_URL}/products` },
    { name: categorySlug, url: `${SITE_URL}/products/${categorySlug}` },
    { name: productSlug, url: productUrl },
  ];

  const structuredData = generateWebPageSchema({
    title: `${productSlug} - AMC Systems`,
    description: `Shop ${productSlug}`,
    url: productUrl,
    breadcrumbs,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <ProductDetailClient productSlug={productSlug} categorySlug={categorySlug} />
      </main>
    </>
  );
}

