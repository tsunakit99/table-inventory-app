// 検索関連の型定義

import { CheckStatus } from './database'
import { Product } from './products'

// 検索フィルターの型
export interface SearchFilters {
  query: string
  categoryId: string
  statusFilters: CheckStatus[]
}

// フィルター済み商品結果の型
export interface FilteredProductsResult {
  products: Product[]
  totalCount: number
}