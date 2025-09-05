'use server'

import { createClient } from '@/lib/supabase/server'
import { getUser } from './auth'
import type { SupabaseClient } from '@supabase/supabase-js'

// 内部用削除関数
async function deleteAvatarInternal(supabase: SupabaseClient, userId: string): Promise<void> {
  // アバターディレクトリ内の全ファイルを取得
  const { data: files, error: listError } = await supabase.storage
    .from('user-content')
    .list(`${userId}/avatars/`)

  if (listError) {
    console.error('Avatar list error:', listError)
    return
  }

  if (files && files.length > 0) {
    // 具体的なファイルパスで削除
    const filesToDelete = files.map(file => `${userId}/avatars/${file.name}`)
    
    const { error } = await supabase.storage
      .from('user-content')
      .remove(filesToDelete)

    if (error) {
      console.error('Avatar delete error:', error)
    }
  }
}

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
  
  // 既存のアバター画像を削除
  await deleteAvatarInternal(supabase, user.id)
  
  // 削除完了を保証するための短い待機
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // ユーザーごとのファイルパスを生成（タイムスタンプ付き）
  const timestamp = Date.now()
  const filePath = `${user.id}/avatars/avatar_${timestamp}.${fileExt}`

  const { error } = await supabase.storage
    .from('user-content')
    .upload(filePath, file)

  if (error) {
    console.error('Avatar upload error:', error)
    throw new Error('画像のアップロードに失敗しました')
  }

  // 公開URLを取得（キャッシュバスター付き）
  const { data: { publicUrl } } = supabase.storage
    .from('user-content')
    .getPublicUrl(filePath)

  // キャッシュを無効化するためのタイムスタンプを追加
  return `${publicUrl}?v=${timestamp}`
}

export async function deleteAvatar(): Promise<void> {
  const supabase = await createClient()
  const user = await getUser()
  
  if (!user) {
    throw new Error('ユーザーが認証されていません')
  }

  await deleteAvatarInternal(supabase, user.id)
}
