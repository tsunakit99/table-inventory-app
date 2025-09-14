import { getCheckHistory } from '@/actions/history'
import { getNotificationSummary } from '@/actions/notifications'
import { HistoryPageContent } from '@/components/features/history/HistoryPageContent'

export default async function HistoryPage() {
  const [initialCheckHistory, initialNotifications] = await Promise.all([
    getCheckHistory(),
    getNotificationSummary()
  ])

  return (
    <HistoryPageContent 
      initialCheckHistory={initialCheckHistory}
      initialNotifications={initialNotifications}
    />
  )
}