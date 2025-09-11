'use server'

import { createClient } from '@/lib/supabase/server'
import { Category, CategoryInsert } from '@/types/categories'
import { revalidatePath } from 'next/cache'

export async function addCategory(categoryName: string): Promise<Category> {
  const supabase = await createClient()

  const insertData: CategoryInsert = {
    name: categoryName
  }

  const { data, error } = await supabase
    .from('categories')
    // @ts-expect-error: Supabase type inference issue
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('Category creation error:', error)
    throw new Error('カテゴリの作成に失敗しました')
  }

  revalidatePath('/')
  return data
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Categories fetch error:', error)
    throw new Error('カテゴリの取得に失敗しました')
  }

  return data || []
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const supabase = await createClient()

  // まずそのカテゴリに属する商品の数をチェック
  const { data: productCount, error: countError } = await supabase
    .from('products')
    .select('id', { count: 'exact' })
    .eq('category_id', categoryId)

  if (countError) {
    console.error('Product count error:', countError)
    throw new Error('商品数の確認に失敗しました')
  }

  if (productCount && productCount.length > 0) {
    throw new Error('このカテゴリには商品が登録されているため削除できません。先に商品を削除するか、別のカテゴリに移動してください。')
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)

  if (error) {
    console.error('Category deletion error:', error)
    throw new Error('カテゴリの削除に失敗しました')
  }

  revalidatePath('/')
}
