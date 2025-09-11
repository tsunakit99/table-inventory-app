'use client'

import { useState, useMemo, useCallback, Suspense, useTransition } from 'react'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { InventoryContent } from './InventoryContent'
import { FilteredProductsResult } from '@/types/search'
import { NotificationSummary } from '@/types/notifications'
import { Category } from '@/types/categories'
import { CheckHistoryItem } from '@/types/history'
import { getFilteredProducts } from '@/actions/products'
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all')
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
  const handleSelectedCategoryId = useCallback((id: string) => {
    setSelectedCategoryId(id)
  }, [])

  const handleCategories = useCallback((newCategories: Category[]) => {
    setCategories(newCategories)
  }, [])


  // カテゴリフィルタリング済みのデータ
  const filteredData = useMemo(() => {
    let products
    
    if (selectedCategoryId === 'all') {
      products = currentData.products
    } else {
      // カテゴリフィルタリング
      const filtered = initialProducts.products.filter(product => {
        return product.category_id === selectedCategoryId
      })
      
      products = { products: filtered, totalCount: filtered.length }
    }

    return {
      products,
      notifications: currentData.notifications,
      checkHistory: currentData.checkHistory
    }
  }, [selectedCategoryId, currentData.products, currentData.notifications, currentData.checkHistory, initialProducts])

  return (
    <ErrorBoundary>
      <Suspense fallback={<InventoryLoadingSkeleton />}>
        <InventoryContent
          data={filteredData}
          selectedCategoryId={selectedCategoryId}
          onSelectedCategoryId={handleSelectedCategoryId}
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
