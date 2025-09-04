import InventoryHome from '@/components/InventoryHome'
import { getFilteredProducts } from '@/actions/search'
import { getNotificationSummary } from '@/actions/notifications'
import { getCheckHistory } from '@/actions/history'
import { mockCategories } from '@/data/mockData'

// Server Component でデータを取得
export default async function Home() {
  // 初期データを並行取得
  const [initialProducts, initialNotifications, initialCheckHistory] = await Promise.all([
    getFilteredProducts({ query: '', categoryId: 'all', statusFilters: [] }),
    getNotificationSummary(),
    getCheckHistory()
  ])

  return (
    <InventoryHome 
      initialCategories={mockCategories}
      initialProducts={initialProducts}
      initialNotifications={initialNotifications}
      initialCheckHistory={initialCheckHistory}
    />
  )
}