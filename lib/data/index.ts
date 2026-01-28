import categoriesData from "./categories.json";
import productsData from "./products.json";
import companyData from "./company.json";
import newsData from "./news.json";
import type { Category, Product, Company, NewsArticle } from "../types";

export const categories: Category[] = categoriesData as Category[];
export const products: Product[] = (productsData as any[]).map(product => ({
  ...product,
  specifications: Object.fromEntries(
    Object.entries(product.specifications || {}).filter(([_, value]) => value !== undefined)
  )
}));
export const company: Company = companyData as Company;
export const news: NewsArticle[] = newsData as NewsArticle[];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((product) => product.categorySlug === categorySlug);
}

export function getProductBySlug(
  categorySlug: string,
  productSlug: string
): Product | undefined {
  return products.find(
    (product) =>
      product.categorySlug === categorySlug && product.slug === productSlug
  );
}

export function getRelatedProducts(
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

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return news.find((article) => article.slug === slug);
}

export function getRelatedNews(
  articleId: string,
  category: string,
  limit: number = 3
): NewsArticle[] {
  return news
    .filter(
      (article) =>
        article.id !== articleId && article.category === category
    )
    .slice(0, limit);
}

