'use server'

import { createClient } from '@/lib/supabase/server'
import { SearchFilters, FilteredProductsResult } from '@/types/search'

export async function getFilteredProducts(filters: SearchFilters): Promise<FilteredProductsResult> {
  const supabase = await createClient()

  let supabaseQuery = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('name')

  // カテゴリフィルター
  if (filters.categoryId !== 'all') {
    supabaseQuery = supabaseQuery.eq('category_id', filters.categoryId)
  }

  // 検索フィルター
  if (filters.query) {
    supabaseQuery = supabaseQuery.ilike('name', `%${filters.query}%`)
  }

  // ステータスフィルター
  if (filters.statusFilters.length > 0) {
    supabaseQuery = supabaseQuery.in('check_status', filters.statusFilters)
  }

  const { data, error, count } = await supabaseQuery

  if (error) {
    console.error('Products search error:', error)
    throw new Error('商品の検索に失敗しました')
  }

  return {
    products: data || [],
    totalCount: count || 0
  }
}