'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionType } from '@/types/database'
import { ProductUpdate } from '@/types/products'
import { CheckSubmitData } from '@/types/inventory'
import { CheckHistoryInsert } from '@/types/history'
import { getUser } from '@/actions/users'
import { HISTORY_SEARCH_LIMIT } from '@/lib/constants/timing'
import { revalidatePath } from 'next/cache'

export async function updateProductCheck(
  productId: string, 
  _productName: string, 
  data: CheckSubmitData
): Promise<void> {
  const supabase = await createClient()
  const user = await getUser()
  
  if (!user) {
    throw new Error('認証が必要です')
  }

  // 商品のチェックステータスを更新
  const updateData: ProductUpdate = { 
    check_status: data.status 
  }
  const { error: updateError } = await supabase
    .from('products')
    // @ts-expect-error: Supabase type inference issue with complex types
    .update(updateData)
    .eq('id', productId)

  if (updateError) {
    console.error('Product update error:', updateError)
    throw new Error('商品のチェックステータス更新に失敗しました')
  }

  // 警告→緊急の昇格パターンの場合、前の履歴をチェック
  if (data.status === 'RED') {
    const { data: existingHistory } = await supabase
      .from('check_history')
      .select('*')
      .eq('product_id', productId)
      .eq('action_type', 'CHECK_YELLOW')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(HISTORY_SEARCH_LIMIT)

    // 警告→緊急の昇格の場合、前の警告履歴を削除して統合メッセージで新しい履歴を作成
    if (existingHistory && existingHistory.length > 0) {
      await supabase
        .from('check_history')
        .delete()
        .eq('id', (existingHistory[0] as { id: string }).id)
    }
  }

  // チェック履歴を追加
  let actionType: ActionType
  switch (data.status) {
    case 'YELLOW':
      actionType = 'CHECK_YELLOW'
      break
    case 'RED':
      actionType = 'CHECK_RED'
      break
    case 'NONE':
      actionType = 'UNCHECK'
      break
  }

  const historyData: CheckHistoryInsert = {
    product_id: productId,
    action_type: actionType,
    quantity: data.quantity || null,
    note: data.note || null,
    user_id: user.id,
    status: 'PENDING'
  }
  const { error: historyError } = await supabase
    .from('check_history')
    // @ts-expect-error: Supabase type inference issue with complex types
    .insert(historyData)

  if (historyError) {
    console.error('Check history creation error:', historyError)
    throw new Error('チェック履歴の作成に失敗しました')
  }

  revalidatePath('/')
}

