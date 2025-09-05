'use server'

import { createClient } from '@/lib/supabase/server'
import { getUser } from './auth'

export async function uploadAvatar(formData: FormData): Promise<string> {
  const supabase = await createClient()
  const user = await getUser()
  
  if (!user) {
    throw new Error('ユーザーが認証されていません')
  }

  const file = formData.get('avatar') as File
  if (!file) {
    throw new Error('ファイルが選択されていません')
  }

  // ファイル拡張子を取得
  const fileExt = file.name.split('.').pop()
  
  // ユーザーごとのファイルパスを生成
  const filePath = `${user.id}/avatars/avatar.${fileExt}`
  
  console.log('Upload attempt:', {
    userId: user.id,
    filePath,
    fileSize: file.size,
    fileType: file.type
  })

  const { error } = await supabase.storage
    .from('user-content')
    .upload(filePath, file, {
      upsert: true // 既存ファイルを上書き
    })

  if (error) {
    console.error('Avatar upload error:', error)
    throw new Error('画像のアップロードに失敗しました')
  }

  // 公開URLを取得
  const { data: { publicUrl } } = supabase.storage
    .from('user-content')
    .getPublicUrl(filePath)

  return publicUrl
}

export async function deleteAvatar(): Promise<void> {
  const supabase = await createClient()
  const user = await getUser()
  
  if (!user) {
    throw new Error('ユーザーが認証されていません')
  }

  // 既存のアバター画像を削除
  const { error } = await supabase.storage
    .from('user-content')
    .remove([`${user.id}/avatars/`])

  if (error) {
    console.error('Avatar delete error:', error)
    // 削除エラーは非クリティカルなのでログのみ
  }
}