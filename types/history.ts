// 履歴関連の型定義

import { CheckStatus, ActionType, CompletionStatus } from './database'

// チェック履歴項目の型（UI表示用）
export interface CheckHistoryItem {
  id: string
  productName: string
  status: CheckStatus
  checkedAt: Date
  quantity?: number
  note?: string
  userId: string
  checkerName?: string
  completionStatus: CompletionStatus
  completedBy?: string
  completerName?: string
  completedAt?: Date
}

// Supabase insert用の型
export interface CheckHistoryInsert {
  product_id: string
  action_type: ActionType
  quantity?: number | null
  note?: string | null
  user_id: string
  status?: CompletionStatus
}

// Supabase クエリのレスポンス型定義
export interface CheckHistoryWithRelations {
  id: string
  product_id: string
  action_type: ActionType
  quantity: number | null
  note: string | null
  user_id: string
  status: CompletionStatus
  completed_by: string | null
  completed_at: string | null
  created_at: string
  product: {
    id: string
    name: string
    category_id: string
    check_status: string
    created_at: string
    updated_at: string
    category: {
      id: string
      name: string
      created_at: string
      updated_at: string
    }
  }
}