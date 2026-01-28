/**
 * Product Detail Skeleton
 * Loading placeholder for product detail page
 */

export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Image skeleton */}
        <div className="w-full h-96 bg-gray-200 rounded-lg" />

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="space-y-2 mt-6">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>

      {/* Key Features skeleton */}
      <div className="mb-8">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>

      {/* Specifications skeleton */}
      <div>
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
