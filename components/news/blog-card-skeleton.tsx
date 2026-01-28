export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 animate-pulse">
      <div className="relative aspect-[16/9] bg-slate-200" />
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-4 bg-slate-200 rounded" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>

        <div className="space-y-2 mb-3">
          <div className="h-6 bg-slate-200 rounded w-full" />
          <div className="h-6 bg-slate-200 rounded w-3/4" />
        </div>

        <div className="space-y-2 mb-4">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
        </div>

        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
          <div className="h-6 w-20 bg-slate-200 rounded-full" />
        </div>

        <div className="h-5 w-24 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

export function BlogCardSkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
