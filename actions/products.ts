'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ProductCreateRequest, ProductInsert } from '@/types/products'

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