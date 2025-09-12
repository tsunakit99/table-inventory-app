export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Header Skeleton */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto" />
          <div className="mt-4 h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="mt-2 h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>

        {/* Form Skeleton */}
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          
          <div className="h-10 bg-blue-100 rounded animate-pulse" />
          
          <div className="text-center">
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}