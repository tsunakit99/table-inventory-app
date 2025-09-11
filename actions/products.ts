'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ProductCreateRequest, ProductInsert, Product } from '@/types/products'
import { SearchFilters, FilteredProductsResult } from '@/types/search'

export async function addProduct(productData: ProductCreateRequest): Promise<void> {
  const supabase = await createClient()

  const insertData: ProductInsert = {
    name: productData.name,
    category_id: productData.categoryId,
    check_status: 'NONE'
  }
  const { error } = await supabase
    .from('products')
    // @ts-expect-error: Supabase type inference issue with complex types
    .insert(insertData)

  if (error) {
    console.error('Product creation error:', error)
    throw new Error('商品の作成に失敗しました')
  }

  revalidatePath('/')
}

export async function deleteProduct(productId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    console.error('Product deletion error:', error)
    throw new Error('商品の削除に失敗しました')
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