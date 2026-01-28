/**
 * Server-side data fetching utilities for SSR/ISR
 * These functions work with JSON data files for static generation
 */

import { categories, products, news } from "./data";
import type { Category, Product, NewsArticle } from "./types";

/**
 * Get all categories (server-side)
 */
export function getCategoriesServer(): Category[] {
  return categories;
}

/**
 * Get category by slug (server-side)
 */
export function getCategoryBySlugServer(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

/**
 * Get all products (server-side)
 */
export function getProductsServer(): Product[] {
  return products;
}

/**
 * Get products by category slug (server-side)
 */
export function getProductsByCategoryServer(categorySlug: string): Product[] {
  return products.filter((product) => product.categorySlug === categorySlug);
}

/**
 * Get product by slugs (server-side)
 */
export function getProductBySlugsServer(
  categorySlug: string,
  productSlug: string
): Product | undefined {
  return products.find(
    (product) =>
      product.categorySlug === categorySlug && product.slug === productSlug
  );
}

/**
 * Get related products (server-side)
 */
export function getRelatedProductsServer(
  productId: string,
  categorySlug: string,
  limit: number = 4
): Product[] {
  return products
    .filter(
      (product) =>
        product.id !== productId && product.categorySlug === categorySlug
    )
    .slice(0, limit);
}

/**
 * Get all news articles (server-side)
 */
export function getNewsServer(): NewsArticle[] {
  return news;
}

/**
 * Get news article by slug (server-side)
 */
export function getNewsBySlugServer(slug: string): NewsArticle | undefined {
  return news.find((article) => article.slug === slug);
}

/**
 * Get related news articles (server-side)
 */
export function getRelatedNewsServer(
  articleId: string,
  category: string,
  limit: number = 3
): NewsArticle[] {
  return news
    .filter(
      (article) => article.id !== articleId && article.category === category
    )
    .slice(0, limit);
}

/**
 * Helper to create URL slug from name and ID
 */
export function createSlug(name: string, id: string): string {
  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")}-${id}`;
}

/**
 * Helper to extract ID from slug
 */
export function extractIdFromSlug(slug: string): string {
  const parts = slug.split("-");
  return parts[parts.length - 1] || slug;
}

