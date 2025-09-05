// カテゴリ関連の型定義

export interface Category {
  id: string
  name: string
}

// カテゴリ作成用の型
export interface CategoryCreateRequest {
  name: string
}

// Supabase insert/update用の型
export interface CategoryInsert {
  name: string
}

export interface CategoryUpdate {
  name?: string
}