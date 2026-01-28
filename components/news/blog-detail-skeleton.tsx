export function BlogDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero Section */}
      <div className="relative pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-10 md:pb-12 bg-gradient-to-b from-slate-900 to-navy-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-8 w-32 bg-slate-700 rounded-full mb-6" />
          <div className="space-y-4 mb-6">
            <div className="h-12 bg-slate-700 rounded w-full" />
            <div className="h-12 bg-slate-700 rounded w-3/4" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-5 w-24 bg-slate-700 rounded" />
            <div className="h-5 w-32 bg-slate-700 rounded" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative aspect-[16/9] bg-slate-200 rounded-2xl mb-8" />
          
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-4/5" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
