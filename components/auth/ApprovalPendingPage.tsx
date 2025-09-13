'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Clock, Mail, RefreshCw } from 'lucide-react'
import { Profile } from '@/actions/profiles'

interface ApprovalPendingPageProps {
  profile: Profile
  onRefresh: () => void
}

export function ApprovalPendingPage({ profile, onRefresh }: ApprovalPendingPageProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      onRefresh()
    }, 30000)

    return () => clearInterval(interval)
  }, [onRefresh])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Show loading for better UX
    onRefresh()
    setIsRefreshing(false)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            承認待ち
          </h1>
          
          <p className="text-gray-600 mb-6">
            アカウントの承認をお待ちください。管理者による承認後、アプリケーションをご利用いただけます。
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">メールアドレス:</span>
              <span className="font-medium">{profile.email}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-500">申請日時:</span>
              <span className="font-medium">
                {new Date(profile.created_at).toLocaleString('ja-JP')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  確認中...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  承認状態を確認
                </>
              )}
            </Button>

            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              別のアカウントでサインイン
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">承認プロセス</p>
                <p>
                  管理者にメール通知が送信されました。通常、24時間以内に承認が行われます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}