'use client'

import { useState, useMemo, useCallback, Suspense, useTransition } from 'react'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { InventoryContent } from './InventoryContent'
import { FilteredProductsResult } from '@/types/search'
import { NotificationSummary } from '@/types/notifications'
import { CheckStatus } from '@/types/database'
import { Category } from '@/types/categories'
import { CheckHistoryItem } from '@/types/history'
import { getFilteredProducts } from '@/actions/search'
import { getNotificationSummary } from '@/actions/notifications'
import { getCheckHistory } from '@/actions/history'

interface InventoryDataProviderProps {
  initialCategories: Category[]
  initialProducts: FilteredProductsResult
  initialNotifications: NotificationSummary
  initialCheckHistory: CheckHistoryItem[]
}

export function InventoryDataProvider({ 
  initialCategories,
  initialProducts,
  initialNotifications,
  initialCheckHistory
}: InventoryDataProviderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all')
  const [statusFilters, setStatusFilters] = useState<CheckStatus[]>([])
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  
  // データ状態管理
  const [currentData, setCurrentData] = useState({
    products: initialProducts,
    notifications: initialNotifications,
    checkHistory: initialCheckHistory
  })
  const [isPending, startTransition] = useTransition()

  // データ再取得関数
  const refreshData = useCallback(async () => {
    startTransition(async () => {
      const [products, notifications, checkHistory] = await Promise.all([
        getFilteredProducts({ query: '', categoryId: 'all', statusFilters: [] }),
        getNotificationSummary(),
        getCheckHistory()
      ])
      
      setCurrentData({
        products,
        notifications,
        checkHistory
      })
    })
  }, [])

  // コールバックを安定化
  const handleSearchQuery = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleSelectedCategoryId = useCallback((id: string) => {
    setSelectedCategoryId(id)
  }, [])

  const handleStatusFilters = useCallback((filters: CheckStatus[]) => {
    setStatusFilters(filters)
  }, [])

  const handleCategories = useCallback((newCategories: Category[]) => {
    setCategories(newCategories)
  }, [])


  // フィルタ変更時のデータ
  const filteredData = useMemo(() => {
    let products
    
    if (searchQuery === '' && selectedCategoryId === 'all' && statusFilters.length === 0) {
      products = currentData.products
    } else {
      // フィルタが変更されている場合はクライアントサイドフィルタリング
      const filtered = initialProducts.products.filter(product => {
        // カテゴリフィルター
        if (selectedCategoryId !== 'all' && product.category_id !== selectedCategoryId) {
          return false
        }
        // 検索フィルター
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false
        }
        // ステータスフィルター
        if (statusFilters.length > 0 && !statusFilters.includes(product.check_status)) {
          return false
        }
        return true
      })
      
      products = { products: filtered, totalCount: filtered.length }
    }

    return {
      products,
      notifications: currentData.notifications,
      checkHistory: currentData.checkHistory
    }
  }, [searchQuery, selectedCategoryId, statusFilters, currentData.products, currentData.notifications, currentData.checkHistory, initialProducts])

  return (
    <ErrorBoundary>
      <Suspense fallback={<InventoryLoadingSkeleton />}>
        <InventoryContent
          data={filteredData}
          onSearchQuery={handleSearchQuery}
          selectedCategoryId={selectedCategoryId}
          onSelectedCategoryId={handleSelectedCategoryId}
          onStatusFilters={handleStatusFilters}
          categories={categories}
          onCategories={handleCategories}
          onRefreshData={refreshData}
          isPending={isPending}
        />
      </Suspense>
    </ErrorBoundary>
  )
}

function InventoryLoadingSkeleton() {
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
