'use server'

import { createClient } from '@/lib/supabase/server'
import { CheckHistoryItem, CheckHistoryWithRelations } from '@/types/history'
import { getUser } from '@/actions/users'
import { getUserInfos } from '@/actions/users'
import { COMPLETED_HISTORY_LIMIT } from '@/lib/constants/timing'
import { revalidatePath } from 'next/cache'
import { logWarning } from '@/lib/utils/error-handler'

export async function getCheckHistory(): Promise<CheckHistoryItem[]> {
  const supabase = await createClient()

  // まず履歴データを取得
  const { data: pendingData, error: pendingError } = await supabase
    .from('check_history')
    .select(`
      *,
      product:products(
        *,
        category:categories(*)
      )
    `)
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false })

  const { data: completedData, error: completedError } = await supabase
    .from('check_history')
    .select(`
      *,
      product:products(
        *,
        category:categories(*)
      )
    `)
    .eq('status', 'COMPLETED')
    .order('completed_at', { ascending: false })
    .limit(COMPLETED_HISTORY_LIMIT)

  if (pendingError) {
    logWarning(pendingError, 'pending-history-fetch-db', 'Pending history fetch error')
    throw new Error('未完了履歴の取得に失敗しました')
  }

  if (completedError) {
    logWarning(completedError, 'completed-history-fetch-db', 'Completed history fetch error')
    throw new Error('完了済み履歴の取得に失敗しました')
  }

  // 両方のデータを結合
  const allData = [...(pendingData || []), ...(completedData || [])] as CheckHistoryWithRelations[]

  // 全ユーザーIDを収集してユーザー情報を一括取得
  const userIds: string[] = []
  allData.forEach(item => {
    userIds.push(item.user_id)
    if (item.completed_by) {
      userIds.push(item.completed_by)
    }
  })
  
  const userInfoMap = await getUserInfos(userIds)

  // データ変換
  const checkHistory: CheckHistoryItem[] = allData.map((item: CheckHistoryWithRelations) => {
    const checkerInfo = userInfoMap.get(item.user_id)
    const completerInfo = item.completed_by ? userInfoMap.get(item.completed_by) : undefined

    return {
      id: item.id,
      productId: item.product_id,
      productName: item.product.name,
      status: item.action_type === 'CHECK_YELLOW' ? 'YELLOW' : 
              item.action_type === 'CHECK_RED' ? 'RED' : 'NONE',
      checkedAt: new Date(item.created_at),
      quantity: item.quantity || undefined,
      note: item.note || undefined,
      userId: item.user_id,
      checkerName: checkerInfo?.name,
      checkerAvatarUrl: checkerInfo?.avatarUrl,
      completionStatus: item.status,
      completedBy: item.completed_by || undefined,
      completerName: completerInfo?.name,
      completerAvatarUrl: completerInfo?.avatarUrl,
      completedAt: item.completed_at ? new Date(item.completed_at) : undefined
    }
  })

  return checkHistory
}

export async function completeCheckHistory(historyId: string, productId: string): Promise<void> {
  const supabase = await createClient()
  const user = await getUser()
  
  if (!user) {
    throw new Error('認証が必要です')
  }

  // RPC関数を使用してアトミックに処理
  const { error } = await supabase
    // @ts-expect-error: Supabase RPC function not in type definitions
    .rpc('complete_check_history', {
      history_id: historyId,
      product_id: productId,
      completed_by_user: user.id,
      completed_at_time: new Date().toISOString()
    })

  if (error) {
    logWarning(error, 'history-completion-rpc', 'Check history completion RPC error')
    throw new Error('履歴の完了処理に失敗しました')
  }

  // 特定のパスのみをrevalidate
  revalidatePath('/', 'page')
}
