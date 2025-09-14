'use server'

import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/actions/users'

export interface Profile {
  id: string
  email: string
  is_approved: boolean
  approved_at?: string
  created_at: string
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const user = await getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}