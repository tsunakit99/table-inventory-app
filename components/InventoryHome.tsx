'use client'

import { InventoryDataProvider } from '@/components/features/inventory/InventoryDataProvider'
import { Category } from '@/types/categories'
import { FilteredProductsResult } from '@/types/search'
import { NotificationSummary } from '@/types/notifications'
import { CheckHistoryItem } from '@/types/history'

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