export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  slug: string;
  title: string;
  brand: string;
  categoryId: string;
  categorySlug: string;
  description: string;
  shortDescription: string;
  price?: number;
  currency?: string;
  images: string[];
  keyFeatures: string[];
  specifications: Record<string, string>;
  warranty: string;
}

export interface Company {
  story: string;
  mission: string;
  vision: string;
  values: string[];
  timeline: TimelineEvent[];
  team: TeamMember[];
  certifications: string[];
  partnerships: string[];
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: "Company News" | "Product Launches" | "Industry Insights";
  featuredImage: string;
  readingTime: number;
}

