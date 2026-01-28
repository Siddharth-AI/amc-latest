"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}



export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80";
console.log(product,"slug check=>>>>>>>>>>>>>>>>>>>>");
  return (
    <div className="card-hover">
      <Link href={`/products/${product.category?.slug || 'category'}/${product.slug}`}>
        <Card className="h-full overflow-hidden group" hover>
          <div className="relative aspect-video mb-4 overflow-hidden rounded-t-xl">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-4 right-4">
              <Badge variant="accent" className="bg-white/90 text-primary">
                {product.brand}
              </Badge>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-text-muted mb-3 line-clamp-2">{product.title}</p>
            {product.price && (
              <p className="text-2xl font-bold text-primary mb-4">
                {product.price.toLocaleString()} {product.currency || "AED"}
              </p>
            )}
            <p className="text-sm text-text-muted mb-4 line-clamp-2">
              {product.shortDescription}
            </p>
            <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
              <span className="text-sm">View Details</span>
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
