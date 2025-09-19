'use client'

import { useEffect } from 'react'
import { InventoryDataProvider } from '@/components/features/inventory/InventoryDataProvider'
import { InstallPrompt } from '@/components/ui/install-prompt'
import { registerSW } from '@/lib/pwa'
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
  useEffect(() => {
    registerSW()
  }, [])

  return (
    <>
      <InventoryDataProvider
        initialCategories={initialCategories}
        initialProducts={initialProducts}
        initialNotifications={initialNotifications}
        initialCheckHistory={initialCheckHistory}
      />
      <InstallPrompt />
    </>
  )
}