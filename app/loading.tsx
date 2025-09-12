export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-40 shadow-lg" style={{ backgroundColor: '#0C1E7D' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
              <div className="w-32 h-6 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        <div className="px-4 pt-4">
          <div className="h-11 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="border-b">
          <div className="flex space-x-2 px-4 py-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        <div className="space-y-0">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-4 border-b">
              <div className="flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}