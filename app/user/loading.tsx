export default function UserLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-40 shadow-lg" style={{ backgroundColor: '#0C1E7D' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/10 rounded animate-pulse" />
              <div className="w-24 bg-white/10 h-6 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Skeleton */}
      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse mx-auto" />
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="pt-4">
            <div className="h-10 w-full bg-red-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}