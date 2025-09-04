'use client'

import Image from 'next/image'
import { User } from 'lucide-react'
import { memo } from 'react'
import { NotificationButton } from '@/components/features/history/NotificationButton'

interface AppHeaderProps {
  hasNewNotifications?: boolean
  notificationCount?: number
  onNotificationClick?: () => void
  onUserIconClick?: () => void
}

export const AppHeader = memo(function AppHeader({
  hasNewNotifications = false,
  notificationCount = 0,
  onNotificationClick,
  onUserIconClick
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 shadow-lg" style={{ backgroundColor: '#0C1E7D' }}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* ユーザーアイコン */}
            <button
              onClick={onUserIconClick}
              className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <User className="h-5 w-5 text-white" />
            </button>
            {/* ロゴ画像 */}
            <Image
              src="/tableicon.png"
              alt="居食屋 たーぶる"
              width={200}
              height={50}
              className="object-contain w-auto h-[30px]"
              priority
            />
          </div>
          
          <NotificationButton
            hasNewNotifications={hasNewNotifications}
            notificationCount={notificationCount}
            onClick={onNotificationClick}
            className="text-white hover:bg-blue-700"
          />
        </div>
      </div>
    </header>
  )
})
