'use server'

import { Product } from '@/components/features/products/ProductList'

export interface CheckSubmitData {
  status: 'YELLOW' | 'RED' | 'NONE'
  quantity?: number
  note?: string
}

export async function updateProductCheck(
  productId: string, 
  productName: string, 
  data: CheckSubmitData
): Promise<void> {
  // TODO: 実際のAPI呼び出しに置き換える
  console.log('チェック更新:', {
    productId,
    productName,
    ...data
  })
  
  // TODO: データベース更新処理
  // TODO: チェック履歴への追加処理
}

export async function getProducts(): Promise<Product[]> {
  // TODO: 実際のAPI呼び出しに置き換える
  // 現在はmockDataを使用
  return []
}