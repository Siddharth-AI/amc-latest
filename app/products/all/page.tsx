import type { Metadata } from "next";
import { AllProductsClient } from "./all-products-client";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Softwares - POS Systems & Solutions | AMC Systems",
  description:
    "Browse our complete range of POS systems, retail solutions, and business technology Softwares. Enterprise-grade solutions for your business needs.",
  alternates: { canonical: `${SITE_URL}/products/all` },
  robots: { index: true, follow: true },
};

export default function AllProductsPage() {
  return (
    <main>
      <AllProductsClient />
    </main>
  );
}
