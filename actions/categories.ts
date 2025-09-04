'use server'

import { Category } from '@/components/features/categories/CategoryTabs'

export async function addCategory(categoryName: string): Promise<Category> {
  // TODO: 実際のAPI呼び出しに置き換える
  const newCategory: Category = {
    id: Date.now().toString(), // 仮のID生成
    name: categoryName
  }
  
  console.log('カテゴリ追加:', newCategory)
  return newCategory
}

export async function getCategories(): Promise<Category[]> {
  // TODO: 実際のAPI呼び出しに置き換える
  // 現在はmockDataを使用
  return []
}