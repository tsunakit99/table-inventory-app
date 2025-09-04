'use server'

import { CheckHistoryItem } from '@/components/features/history/NotificationModal'

export async function getCheckHistory(): Promise<CheckHistoryItem[]> {
  // TODO: 実際のAPI呼び出しに置き換える
  // 現在はmockDataを使用
  const { mockCheckHistory } = await import('@/data/mockData')
  return mockCheckHistory
}

export async function addCheckHistoryItem(
  productName: string,
  status: 'YELLOW' | 'RED' | 'NONE',
  quantity?: number,
  note?: string
): Promise<CheckHistoryItem> {
  // TODO: 実際のAPI呼び出しに置き換える
  const newHistoryItem: CheckHistoryItem = {
    id: Date.now().toString(),
    productName,
    status,
    checkedAt: new Date(),
    quantity,
    note
  }
  
  console.log('チェック履歴追加:', newHistoryItem)
  return newHistoryItem
}