// 商品関連の型定義

import { CheckStatus } from './database'

export interface Product {
  id: string
  name: string
  category_id: string
  check_status: CheckStatus
  created_at: string
  updated_at: string
}

// 商品作成用の型
export interface ProductCreateRequest {
  name: string
  categoryId: string
}

// 商品削除用の型
export interface ProductDeleteRequest {
  productId: string
}

// Supabase insert/update用の型
export interface ProductInsert {
  name: string
  category_id: string
  check_status: CheckStatus
}

export interface ProductUpdate {
  name?: string
  category_id?: string
  check_status?: CheckStatus
}