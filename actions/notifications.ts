'use server'

import { mockCheckHistory } from '@/data/mockData'

export interface NotificationSummary {
  hasNewNotifications: boolean
  notificationCount: number
  redCount: number
  yellowCount: number
}

export async function getNotificationSummary(): Promise<NotificationSummary> {
  // TODO: 実際のAPI呼び出しに置き換える
  const redItems = mockCheckHistory.filter(item => item.status === 'RED')
  const yellowItems = mockCheckHistory.filter(item => item.status === 'YELLOW')
  
  return {
    hasNewNotifications: redItems.length > 0,
    notificationCount: redItems.length,
    redCount: redItems.length,
    yellowCount: yellowItems.length
  }
}