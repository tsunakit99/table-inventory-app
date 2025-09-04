'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NotificationButtonProps {
  hasNewNotifications?: boolean
  notificationCount?: number
  onClick?: () => void
  className?: string
}

export function NotificationButton({
  hasNewNotifications = false,
  notificationCount = 0,
  onClick,
  className
}: NotificationButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn("relative", className)}
    >
      <Bell className="h-5 w-5" />
      {hasNewNotifications && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {notificationCount > 0 ? (notificationCount > 99 ? '99+' : notificationCount) : ''}
        </Badge>
      )}
    </Button>
  )
}