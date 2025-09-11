'use server'

import { createClient } from '@/lib/supabase/server'
import { NotificationSummary } from '@/types/notifications'
import { logWarning } from '@/lib/utils/error-handler'

export async function getNotificationSummary(): Promise<NotificationSummary> {
  const supabase = await createClient()

  // 未完了のチェック履歴を取得して通知数を計算
  const { data, error } = await supabase
    .from('check_history')
    .select('id')
    .eq('status', 'PENDING')

  if (error) {
    logWarning(error, 'notifications-fetch-db', 'Notifications fetch error')
    throw new Error('通知の取得に失敗しました')
  }

  const notificationCount = data?.length || 0
  const hasNewNotifications = notificationCount > 0

  return {
    hasNewNotifications,
    notificationCount
  }
}