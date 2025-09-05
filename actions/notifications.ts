'use server'

import { createClient } from '@/lib/supabase/server'
import { NotificationSummary } from '@/types/notifications'

export async function getNotificationSummary(): Promise<NotificationSummary> {
  const supabase = await createClient()

  // 24時間以内のチェック履歴を取得して通知数を計算
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('check_history')
    .select('id')
    .gte('created_at', twentyFourHoursAgo)

  if (error) {
    console.error('Notifications fetch error:', error)
    throw new Error('通知の取得に失敗しました')
  }

  const notificationCount = data?.length || 0
  const hasNewNotifications = notificationCount > 0

  return {
    hasNewNotifications,
    notificationCount
  }
}