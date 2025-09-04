'use client'

import { memo, useCallback } from 'react'
import { User, Settings, LogOut, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
}

export const SideMenu = memo(function SideMenu({ 
  isOpen, 
  onClose, 
  userName = "ユーザー" 
}: SideMenuProps) {
  const handleBackdropClick = useCallback(() => {
    onClose()
  }, [onClose])

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const handleAccountSettings = useCallback(() => {
    // TODO: アカウント設定画面への遷移
    console.log('アカウント設定')
    onClose()
  }, [onClose])

  const handleLogout = useCallback(() => {
    // TODO: ログアウト処理
    console.log('ログアウト')
    onClose()
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
            <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full">
              <User className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-medium text-lg">{userName}</span>
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