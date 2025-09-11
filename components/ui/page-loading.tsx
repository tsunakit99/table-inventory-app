import { LoadingSpinner } from './loading-spinner'

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = '読み込み中...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

export function ContentLoading({ message = '読み込み中...' }: PageLoadingProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <LoadingSpinner size="md" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}