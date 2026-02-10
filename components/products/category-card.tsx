"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

const categoryImages: Record<string, string> = {
  "pos-systems":
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80",
  "retail-solutions":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  software:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  hardware:
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
  support:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80",
  custom:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
};

export function CategoryCard({ category }: CategoryCardProps) {
  const imageUrl =
    categoryImages[category.slug] ||
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80";

  return (
    <div className="card-hover">
      <Link href={`/products/${category.slug}`}>
        <Card className="h-full overflow-hidden group" hover>
          <div className="relative aspect-video mb-6 overflow-hidden rounded-t-xl">
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-4 right-4">
              <Badge variant="accent" className="bg-white/90 text-primary">
                {category.productCount} Software
              </Badge>
            </div>
          </div>
          <div className="px-6 pb-6">
            <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-text-muted leading-relaxed mb-4">
              {category.description}
            </p>
            <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
              <span className="text-sm">Explore Category</span>
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
