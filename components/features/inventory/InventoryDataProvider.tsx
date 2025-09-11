'use client'

import { useState, useMemo, useCallback, useTransition } from 'react'
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
      <InventoryContent
        data={filteredData}
        selectedCategoryId={selectedCategoryId}
        onSelectedCategoryId={handleSelectedCategoryId}
        categories={categories}
        onCategories={handleCategories}
        onRefreshData={refreshData}
        isPending={isPending}
      />
    </ErrorBoundary>
  )
}
