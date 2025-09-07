'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * 現在認証されているユーザーを取得する
 * @returns User | null
 */
export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * ユーザーの表示名を更新する
 * @param displayName - 新しい表示名
 */
export async function updateDisplayName(displayName: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.updateUser({
    data: { display_name: displayName }
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

/**
 * ユーザーのアバターURLを更新する
 * @param avatarUrl - 新しいアバターURL
 */
export async function updateAvatar(avatarUrl: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl }
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

/**
 * ユーザーIDからユーザー名を取得する（管理者権限）
 * @param userId - ユーザーID
 * @returns ユーザー名（display_name）
 */
export async function getUserDisplayName(userId: string): Promise<string> {
  try {
    const supabase = createAdminClient()
    
    const { data, error } = await supabase.auth.admin.getUserById(userId)
    
    if (error || !data.user) {
      console.warn(`Failed to fetch user ${userId}:`, error)
      return 'Unknown User'
    }
    
    return data.user.user_metadata?.display_name || 'Unknown User'
  } catch (error) {
    console.warn(`Error fetching user ${userId}:`, error)
    return 'Unknown User'
  }
}

