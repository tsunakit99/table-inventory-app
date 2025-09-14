import InventoryHome from '@/components/InventoryHome'
import { getFilteredProducts } from '@/actions/products'
import { getNotificationSummary } from '@/actions/notifications'
import { getCheckHistory } from '@/actions/history'
import { getCategories } from '@/actions/categories'

// Server Component でデータを取得
export default async function Home() {
  // 初期データを並行取得
  const [initialCategories, initialProducts, initialNotifications, initialCheckHistory] = await Promise.all([
    getCategories(),
    getFilteredProducts({ query: '', categoryId: 'all', statusFilters: [] }),
    getNotificationSummary(),
    getCheckHistory()
  ])

  return (
    <InventoryHome
      initialCategories={initialCategories}
      initialProducts={initialProducts}
      initialNotifications={initialNotifications}
      initialCheckHistory={initialCheckHistory}
    />
  )
}