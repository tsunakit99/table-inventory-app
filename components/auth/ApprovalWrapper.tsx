'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile, Profile } from '@/actions/profiles'
import { ApprovalPendingPage } from './ApprovalPendingPage'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface ApprovalWrapperProps {
  children: React.ReactNode
}

export function ApprovalWrapper({ children }: ApprovalWrapperProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchProfile = async () => {
    try {
      const profileData = await getProfile()
      setProfile(profileData)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleRefresh = () => {
    fetchProfile()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!profile) {
    // User not found, redirect to auth
    router.push('/auth')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!profile.is_approved) {
    return (
      <ApprovalPendingPage 
        profile={profile}
        onRefresh={handleRefresh}
      />
    )
  }

  return <>{children}</>
}