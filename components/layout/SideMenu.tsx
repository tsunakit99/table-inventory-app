'use client'

import { memo, useCallback } from 'react'
import { Settings, LogOut, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils/tailwind'
import { getInitials } from '@/lib/utils/user'
import { signOut } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { handleError } from '@/lib/utils/error-handler'

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
  userAvatarUrl?: string | null
}

export const SideMenu = memo(function SideMenu({ 
  isOpen, 
  onClose, 
  userName = "ユーザー",
  userAvatarUrl = null
}: SideMenuProps) {
  const router = useRouter()
  
  const handleBackdropClick = useCallback(() => {
    onClose()
  }, [onClose])

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const handleAccountSettings = useCallback(() => {
    router.push('/user')
    onClose()
  }, [router, onClose])

  const handleLogout = useCallback(async () => {
    try {
      await signOut()
      onClose()
    } catch (error) {
      // Next.jsのredirect()はエラーを投げてナビゲーションするため、
      // NEXT_REDIRECTエラーの場合は正常な処理として扱う
      if (error && typeof error === 'object' && 'digest' in error && 
          typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
        onClose()
        return
      }
      handleError(error, 'logout')
    }
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleBackdropClick}
      />
      
      {/* Side Menu */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        onClick={handleMenuClick}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: '#0C1E7D' }}
        >
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10 border-2 border-white/20">
              <AvatarImage src={userAvatarUrl || undefined} />
              <AvatarFallback className="bg-white/10 text-white text-sm font-medium">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-white font-medium text-lg truncate max-w-[180px]">{userName}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/10 h-10 w-10"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Menu Items */}
        <div className="py-4">
          {/* アカウント設定 */}
          <button
            onClick={handleAccountSettings}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">アカウント設定</span>
            </div>
          </button>

          {/* ログアウト */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8">
                <LogOut className="h-5 w-5 text-red-600" />
              </div>
              <span className="font-medium text-red-600">ログアウト</span>
            </div>
          </button>
        </div>
      </div>
    </>
  )
})
