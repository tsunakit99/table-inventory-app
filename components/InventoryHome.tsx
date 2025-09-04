'use client'

import { InventoryDataProvider } from '@/components/features/inventory/InventoryDataProvider'
import { Category } from '@/components/features/categories/CategoryTabs'
import { FilteredProductsResult } from '@/actions/search'
import { NotificationSummary } from '@/actions/notifications'
import { CheckHistoryItem } from '@/components/features/history/NotificationModal'

interface InventoryHomeProps {
  initialCategories: Category[]
  initialProducts: FilteredProductsResult
  initialNotifications: NotificationSummary
  initialCheckHistory: CheckHistoryItem[]
}

export default function InventoryHome({
  initialCategories,
  initialProducts,
  initialNotifications,
  initialCheckHistory
}: InventoryHomeProps) {
  return (
    <InventoryDataProvider 
      initialCategories={initialCategories}
      initialProducts={initialProducts}
      initialNotifications={initialNotifications}
      initialCheckHistory={initialCheckHistory}
    />
  )
}