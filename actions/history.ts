'use server'

import { createClient } from '@/lib/supabase/server'
import { CheckHistoryItem, CheckHistoryWithRelations } from '@/types/history'

export async function getCheckHistory(): Promise<CheckHistoryItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('check_history')
    .select(`
      *,
      product:products(
        *,
        category:categories(*)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Check history fetch error:', error)
    throw new Error('チェック履歴の取得に失敗しました')
  }

  // データ変換
  const checkHistory: CheckHistoryItem[] = (data as CheckHistoryWithRelations[] || []).map((item: CheckHistoryWithRelations) => ({
    id: item.id,
    productName: item.product.name,
    status: item.action_type === 'CHECK_YELLOW' ? 'YELLOW' : 
            item.action_type === 'CHECK_RED' ? 'RED' : 'NONE',
    checkedAt: new Date(item.created_at),
    quantity: item.quantity || undefined,
    note: item.note || undefined
  }))

  return checkHistory
}