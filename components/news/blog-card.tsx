import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogWithTags } from "@/types";

interface BlogCardProps {
  blog: BlogWithTags;
}

export function BlogCard({ blog }: BlogCardProps) {
  const imageUrl = blog.base_url && blog.img_name 
    ? `${blog.base_url}${blog.img_name}`
    : '/placeholder.png';

  const excerpt = blog.description
    ? blog.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
    : '';

  const date = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/news/${blog.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-primary-500"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={imageUrl}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>

        <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-slate-600 mb-4 line-clamp-3">{excerpt}</p>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="default" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center text-primary-600 font-semibold group-hover:gap-2 transition-all">
          Read More
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
