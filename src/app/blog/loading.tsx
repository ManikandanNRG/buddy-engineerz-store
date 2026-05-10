import { BlogCardSkeleton } from "@/components/skeletons/BlogCardSkeleton"

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Skeleton */}
      <div className="bg-gray-200 animate-pulse py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="h-12 bg-gray-300 rounded w-3/4 mx-auto"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
