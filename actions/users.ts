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

/**
 * 複数のユーザーIDからユーザー名を一括取得する（管理者権限）
 * @param userIds - ユーザーIDの配列
 * @returns ユーザーID -> ユーザー名のマップ
 */
export async function getUserDisplayNames(userIds: string[]): Promise<Map<string, string>> {
  const userNameMap = new Map<string, string>()
  
  // 重複を除去
  const uniqueUserIds = [...new Set(userIds.filter(Boolean))]
  
  // 並列でユーザー情報を取得
  const promises = uniqueUserIds.map(async (userId) => {
    try {
      const supabase = createAdminClient()
      const { data, error } = await supabase.auth.admin.getUserById(userId)
      
      if (error || !data.user) {
        console.warn(`Failed to fetch user ${userId}:`, error)
        return [userId, 'Unknown User'] as [string, string]
      }
      
      const displayName = data.user.user_metadata?.display_name || 'Unknown User'
      return [userId, displayName] as [string, string]
    } catch (error) {
      console.warn(`Error fetching user ${userId}:`, error)
      return [userId, 'Unknown User'] as [string, string]
    }
  })
  
  const results = await Promise.all(promises)
  
  // Mapに結果を格納
  results.forEach(([userId, displayName]) => {
    userNameMap.set(userId, displayName)
  })
  
  return userNameMap
}