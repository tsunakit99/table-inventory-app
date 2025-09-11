'use client'

import { useState, useCallback, memo, useEffect } from 'react'
import { SideMenu } from '@/components/layout/SideMenu'
import { CheckCircle, AlertTriangle, AlertCircle, Clock, CheckCheck } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils/user'
import { cn } from '@/lib/utils/tailwind'
import { CheckHistoryItem } from '@/types/history'
import { NotificationSummary } from '@/types/notifications'
import { completeCheckHistory, getCheckHistory } from '@/actions/history'
import { getNotificationSummary } from '@/actions/notifications'
import { getUser } from '@/actions/users'
import { HistoryDetailModal } from './HistoryDetailModal'
import type { User } from '@supabase/supabase-js'

interface HistoryPageContentProps {
  initialCheckHistory: CheckHistoryItem[]
  initialNotifications: NotificationSummary
}

const NotificationItem = memo(function NotificationItem({ 
  item, 
  onItemClick,
  isLast 
}: {
  item: CheckHistoryItem
  showCompleteButton: boolean
  onComplete?: (id: string) => void
  onItemClick?: (item: CheckHistoryItem) => void
  isLast: boolean
}) {
  const getStatusIcon = (status: 'YELLOW' | 'RED' | 'NONE') => {
    switch (status) {
      case 'YELLOW':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'RED':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div 
      className={cn(
        "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
        !isLast && "border-b border-border"
      )}
      onClick={() => onItemClick?.(item)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getStatusIcon(item.status)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-md truncate">{item.productName}</h3>
            {item.completionStatus === 'COMPLETED' && (
              <CheckCheck className="h-3 w-3 text-green-600 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Clock className="h-3 w-3" />
            <span>
              {item.completionStatus === 'COMPLETED' && item.completedAt
                ? `完了: ${formatDateTime(item.completedAt)}`
                : `チェック: ${formatDateTime(item.checkedAt)}`
              }
            </span>
          </div>
          {/* チェック者情報 */}
          {item.completionStatus === 'PENDING' && item.checkerName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <p>チェック者：</p>
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.checkerAvatarUrl} />
                <AvatarFallback className="text-[8px]">
                  {getInitials(item.checkerName)}
                </AvatarFallback>
              </Avatar>
              <span>{item.checkerName}</span>
            </div>
          )}
          {/* 完了者情報 */}
          {item.completionStatus === 'COMPLETED' && item.completerName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <p>完了者：</p>
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.completerAvatarUrl} />
                <AvatarFallback className="text-[8px]">
                  {getInitials(item.completerName)}
                </AvatarFallback>
              </Avatar>
              <span>{item.completerName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export function HistoryPageContent({ initialCheckHistory, initialNotifications }: HistoryPageContentProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending')
  const [selectedItem, setSelectedItem] = useState<CheckHistoryItem | null>(null)
  const [checkHistory, setCheckHistory] = useState(initialCheckHistory)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // ユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }
    fetchUser()
  }, [])

  const pendingItems = checkHistory.filter(item => item.completionStatus === 'PENDING')
  const completedItems = checkHistory.filter(item => item.completionStatus === 'COMPLETED')

  const sortedPending = [...pendingItems].sort(
    (a, b) => b.checkedAt.getTime() - a.checkedAt.getTime()
  )
  
  const sortedCompleted = [...completedItems].sort(
    (a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)
  )

  const refreshData = useCallback(async () => {
    try {
      const [newHistory, newNotifications] = await Promise.all([
        getCheckHistory(),
        getNotificationSummary()
      ])
      setCheckHistory(newHistory)
      setNotifications(newNotifications)
    } catch (error) {
      console.error('Failed to refresh history:', error)
    }
  }, [])

  const handleComplete = useCallback(async (historyId: string) => {
    try {
      await completeCheckHistory(historyId)
      await refreshData()
    } catch (error: unknown) {
      console.error('Failed to complete history:', error)
      const message = error instanceof Error ? error.message : '完了処理に失敗しました'
      alert(message)
    }
  }, [refreshData])

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'pending' | 'completed')
  }, [])

  const handleItemClick = useCallback((item: CheckHistoryItem) => {
    setSelectedItem(item)
  }, [])

  const handleDetailModalClose = useCallback(() => {
    setSelectedItem(null)
  }, [])

  const handleMenuClick = useCallback(() => {
    setIsSideMenuOpen(true)
  }, [])

  const handleSideMenuClose = useCallback(() => {
    setIsSideMenuOpen(false)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        hasNewNotifications={notifications.hasNewNotifications}
        notificationCount={notifications.notificationCount}
        onMenuClick={handleMenuClick}
      />
      
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6" />
            チェック履歴
          </h1>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="pending" className="relative">
              未完了
              {pendingItems.length > 0 && (
                <span className="ml-1 bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                  {pendingItems.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              完了済み
              {completedItems.length > 0 && (
                <span className="ml-1 bg-green-100 text-green-600 text-xs px-1.5 py-0.5 rounded-full">
                  {completedItems.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-0">
            <div className="bg-card rounded-lg border">
              {sortedPending.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>未完了のチェック項目はありません</p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div>
                    {sortedPending.map((item, index) => (
                      <NotificationItem
                        key={item.id}
                        item={item}
                        showCompleteButton={true}
                        onComplete={handleComplete}
                        onItemClick={handleItemClick}
                        isLast={index === sortedPending.length - 1}
                      />
                    ))}
                  </div>
                  <ScrollBar />
                </ScrollArea>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <div className="bg-card rounded-lg border">
              {sortedCompleted.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>完了済みのチェック項目はありません</p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div>
                    {sortedCompleted.map((item, index) => (
                      <NotificationItem
                        key={item.id}
                        item={item}
                        showCompleteButton={false}
                        onItemClick={handleItemClick}
                        isLast={index === sortedCompleted.length - 1}
                      />
                    ))}
                  </div>
                  <ScrollBar />
                </ScrollArea>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 詳細モーダル */}
      <HistoryDetailModal
        isOpen={!!selectedItem}
        onClose={handleDetailModalClose}
        historyItem={selectedItem}
        onRefreshData={refreshData}
      />

      {/* サイドメニュー */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={handleSideMenuClose}
        userName={user?.user_metadata?.display_name}
        userAvatarUrl={user?.user_metadata?.avatar_url}
      />
    </div>
  )
}
