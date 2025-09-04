'use server'

export async function addProduct(productData: { 
  name: string; 
  categoryId: string 
}): Promise<void> {
  // TODO: 実際のAPI呼び出しに置き換える
  console.log('商品追加:', productData)
  
  // データベースに商品を追加する処理をここに書く
  // await db.products.create({
  //   name: productData.name,
  //   category_id: productData.categoryId,
  //   check_status: 'NONE'
  // })
}

export async function deleteProduct(productId: string): Promise<void> {
  // TODO: 実際のAPI呼び出しに置き換える
  console.log('商品削除:', productId)
  
  // データベースから商品を削除する処理をここに書く
  // await db.products.delete(productId)
}