// 在庫管理関連の型定義

import { CheckStatus } from './database'

// チェック送信データの型
export interface CheckSubmitData {
  status: CheckStatus
  quantity?: number
  note?: string
}

// 商品チェック更新用の型
export interface ProductCheckUpdateRequest {
  productId: string
  productName: string
  data: CheckSubmitData
}