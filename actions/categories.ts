'use server'

import { createClient } from '@/lib/supabase/server'
import { Category, CategoryInsert } from '@/types/categories'
import { revalidatePath } from 'next/cache'
import { logWarning } from '@/lib/utils/error-handler'
import { categorySchema, idSchema } from '@/lib/validations/forms'

export async function addCategory(categoryName: string): Promise<Category> {
  const supabase = await createClient()

  // サーバーサイドバリデーション
  const validation = categorySchema.safeParse({ name: categoryName })
  if (!validation.success) {
    const errorMessage = validation.error.issues.map(issue => issue.message).join(', ')
    logWarning(validation.error, 'category-validation', 'Server-side validation failed')
    throw new Error(errorMessage)
  }

  const validatedData = validation.data
  const insertData: CategoryInsert = {
    name: validatedData.name
  }

  const { data, error } = await supabase
    .from('categories')
    // @ts-expect-error: Supabase type inference issue
    .insert(insertData)
    .select()
    .single()

  if (error) {
    logWarning(error, 'category-create-db', 'Category creation error')
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
    logWarning(error, 'categories-fetch-db', 'Categories fetch error')
    throw new Error('カテゴリの取得に失敗しました')
  }

  return data || []
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const supabase = await createClient()

  // サーバーサイドバリデーション
  const validation = idSchema.safeParse(categoryId)
  if (!validation.success) {
    const errorMessage = validation.error.issues.map(issue => issue.message).join(', ')
    logWarning(validation.error, 'category-id-validation', 'Server-side ID validation failed')
    throw new Error(errorMessage)
  }

  const validatedId = validation.data

  // まずそのカテゴリに属する商品の数をチェック
  const { data: productCount, error: countError } = await supabase
    .from('products')
    .select('id', { count: 'exact' })
    .eq('category_id', validatedId)

  if (countError) {
    logWarning(countError, 'product-count-check', 'Product count error')
    throw new Error('商品数の確認に失敗しました')
  }

  if (productCount && productCount.length > 0) {
    throw new Error('このカテゴリには商品が登録されているため削除できません。先に商品を削除するか、別のカテゴリに移動してください。')
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', validatedId)

  if (error) {
    logWarning(error, 'category-delete-db', 'Category deletion error')
    throw new Error('カテゴリの削除に失敗しました')
  }

  revalidatePath('/')
}
