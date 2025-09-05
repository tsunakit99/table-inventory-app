'use server'

import { createClient } from '@/lib/supabase/server'
import { Category } from '@/types/categories'
import { revalidatePath } from 'next/cache'

export async function addCategory(categoryName: string): Promise<Category> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    // @ts-expect-error: Supabase type inference issue
    .insert({ name: categoryName })
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
