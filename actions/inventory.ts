'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionType } from '@/types/database'
import { Product, ProductUpdate } from '@/types/products'
import { CheckSubmitData } from '@/types/inventory'
import { CheckHistoryInsert } from '@/types/history'
import { revalidatePath } from 'next/cache'

export async function updateProductCheck(
  productId: string, 
  _productName: string, 
  data: CheckSubmitData
): Promise<void> {
  const supabase = await createClient()

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
    note: data.note || null
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

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')

  if (error) {
    console.error('Products fetch error:', error)
    throw new Error('商品の取得に失敗しました')
  }

  return data || []
}