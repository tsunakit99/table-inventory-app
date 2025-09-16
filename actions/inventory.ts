'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionType, CheckStatus } from '@/types/database'
import { ProductUpdate } from '@/types/products'
import { CheckSubmitData } from '@/types/inventory'
import { CheckHistoryInsert } from '@/types/history'
import { getUser } from '@/actions/users'
import { HISTORY_SEARCH_LIMIT } from '@/lib/constants/timing'
import { revalidatePath } from 'next/cache'
import { logWarning } from '@/lib/utils/error-handler'
import { checkSchema } from '@/lib/validations/forms'

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

  // サーバーサイドバリデーション
  const validation = checkSchema.safeParse(data)
  if (!validation.success) {
    const errorMessage = validation.error.issues.map(issue => issue.message).join(', ')
    logWarning(validation.error, 'check-validation', 'Server-side validation failed')
    throw new Error(errorMessage)
  }

  const validatedData = validation.data

  // 現在の商品情報を取得
  const { data: currentProduct, error: fetchError } = await supabase
    .from('products')
    .select('check_status')
    .eq('id', productId)
    .single() as { data: { check_status: CheckStatus } | null, error: Error | null }

  if (fetchError || !currentProduct) {
    logWarning(fetchError, 'product-fetch-db', 'Product fetch error')
    throw new Error('商品情報の取得に失敗しました')
  }

  // 緊急→要注意への格下げをチェック
  if (currentProduct.check_status === 'RED' && validatedData.status === 'YELLOW') {
    throw new Error('緊急状態から要注意への変更はできません')
  }

  // 商品のチェックステータスを更新
  const updateData: ProductUpdate = {
    check_status: validatedData.status
  }
  const { error: updateError } = await supabase
    .from('products')
    // @ts-expect-error: Supabase type inference issue with complex types
    .update(updateData)
    .eq('id', productId)

  if (updateError) {
    logWarning(updateError, 'product-status-update-db', 'Product update error')
    throw new Error('商品のチェックステータス更新に失敗しました')
  }

  // 警告→緊急の昇格パターンの場合、前の履歴をチェック
  if (validatedData.status === 'RED') {
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
  switch (validatedData.status) {
    case 'YELLOW':
      actionType = 'CHECK_YELLOW'
      break
    case 'RED':
      actionType = 'CHECK_RED'
      break
  }

  const historyData: CheckHistoryInsert = {
    product_id: productId,
    action_type: actionType,
    quantity: validatedData.quantity || null,
    note: validatedData.note || null,
    user_id: user.id,
    status: 'PENDING'
  }
  const { error: historyError } = await supabase
    .from('check_history')
    // @ts-expect-error: Supabase type inference issue with complex types
    .insert(historyData)

  if (historyError) {
    logWarning(historyError, 'check-history-create-db', 'Check history creation error')
    throw new Error('チェック履歴の作成に失敗しました')
  }

  revalidatePath('/')
}

