'use server'

import { CheckStatus } from '@/types/database'
import { mockProducts } from '@/data/mockData'

export interface SearchFilters {
  query: string
  categoryId: string
  statusFilters: CheckStatus[]
}

export interface FilteredProductsResult {
  products: typeof mockProducts
  totalCount: number
}

export async function getFilteredProducts(filters: SearchFilters): Promise<FilteredProductsResult> {
  // TODO: 実際のAPI呼び出しに置き換える
  let filtered = mockProducts

  // カテゴリフィルター
  if (filters.categoryId !== 'all') {
    filtered = filtered.filter(product => product.category_id === filters.categoryId)
  }

  // 検索フィルター
  if (filters.query) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(filters.query.toLowerCase())
    )
  }

  // ステータスフィルター
  if (filters.statusFilters.length > 0) {
    filtered = filtered.filter(product => 
      filters.statusFilters.includes(product.check_status)
    )
  }

  return {
    products: filtered,
    totalCount: filtered.length
  }
}