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
 * ユーザーIDからユーザー情報（名前とアバターURL）を取得する（管理者権限）
 * @param userId - ユーザーID
 * @returns ユーザー情報
 */
export async function getUserInfo(userId: string): Promise<{ name: string; avatarUrl?: string }> {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase.auth.admin.getUserById(userId)

    if (error || !data.user) {
      console.warn(`Failed to fetch user ${userId}:`, error)
      return { name: 'Unknown User' }
    }
    
    return {
      name: data.user.user_metadata?.display_name || 'Unknown User',
      avatarUrl: data.user.user_metadata?.avatar_url
    }
  } catch (error) {
    console.warn(`Error fetching user ${userId}:`, error)
    return { name: 'Unknown User' }
  }
}
  
  /**
   * 複数のユーザーIDからユーザー情報を一括取得する（管理者権限）
   * @param userIds - ユーザーIDの配列
  * @returns ユーザーID -> ユーザー情報のマップ
  */
export async function getUserInfos(userIds: string[]): Promise<Map<string, { name: string; avatarUrl?: string }>> {
  const userInfoMap = new Map<string, { name: string; avatarUrl?: string }>()
  
  // 重複を除去
  const uniqueUserIds = [...new Set(userIds.filter(Boolean))]
  
  // 並列でユーザー情報を取得
  const promises = uniqueUserIds.map(async (userId) => {
    const userInfo = await getUserInfo(userId)
    return [userId, userInfo] as [string, { name: string; avatarUrl?: string }]
  })
  
  const results = await Promise.all(promises)
  
  // Mapに結果を格納
  results.forEach(([userId, userInfo]) => {
    userInfoMap.set(userId, userInfo)
  })
  
  return userInfoMap
}
