'use client'

import { useState, useCallback, memo } from 'react'
import { CheckCircle, AlertTriangle, AlertCircle, Clock, CheckCheck, Users } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils/tailwind'
import { CheckHistoryItem } from '@/types/history'
import { completeCheckHistory } from '@/actions/history'
import { HistoryDetailModal } from './HistoryDetailModal'

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  checkHistory: CheckHistoryItem[]
  onRefreshData: () => Promise<void>
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

  const handleItemClick = useCallback(() => {
    if (onItemClick) {
      onItemClick(item)
    }
  }, [onItemClick, item])

  return (
    <div 
      className={cn(
        "flex flex-col gap-2 p-4 transition-colors hover:bg-muted/50 cursor-pointer",
        !isLast && "border-b"
      )}
      onClick={handleItemClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">
            {item.productName}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {item.status !== 'NONE' && (
              <div className="flex items-center">
                {getStatusIcon(item.status)}
              </div>
            )}
            {item.quantity && (
              <span className="text-xs text-muted-foreground">
                数量: {item.quantity}
              </span>
            )}
            {item.completionStatus === 'COMPLETED' && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCheck className="h-3 w-3" />
                <span>完了済み</span>
              </div>
            )}
            {item.checkerName && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Users className="h-3 w-3" />
                <span>チェック: {item.checkerName}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-xs text-muted-foreground flex-shrink-0">
            {formatDateTime(item.checkedAt)}
          </div>
        </div>
      </div>
      {item.note && (
        <p className="text-sm text-muted-foreground">
          {item.note}
        </p>
      )}
      {item.completionStatus === 'COMPLETED' && item.completedAt && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>完了日時: {formatDateTime(item.completedAt)}</span>
          </div>
          {item.completerName && (
            <div className="flex items-center gap-1 text-purple-600">
              <CheckCheck className="h-3 w-3" />
              <span>完了者: {item.completerName}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

export function NotificationModal({
  isOpen,
  onClose,
  checkHistory,
  onRefreshData
}: NotificationModalProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending')
  const [isCompleting, setIsCompleting] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<CheckHistoryItem | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const pendingItems = checkHistory.filter(item => item.completionStatus === 'PENDING')
  const completedItems = checkHistory.filter(item => item.completionStatus === 'COMPLETED')

  const sortedPending = [...pendingItems].sort(
    (a, b) => b.checkedAt.getTime() - a.checkedAt.getTime()
  )
  
  const sortedCompleted = [...completedItems].sort(
    (a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)
  )

  const handleComplete = useCallback(async (historyId: string) => {
    try {
      setIsCompleting(historyId)
      await completeCheckHistory(historyId)
      await onRefreshData()
    } catch (error) {
      console.error('Failed to complete history:', error)
      alert('完了処理に失敗しました')
    } finally {
      setIsCompleting(null)
    }
  }, [onRefreshData])

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'pending' | 'completed')
  }, [])

  const handleItemClick = useCallback((item: CheckHistoryItem) => {
    setSelectedItem(item)
    setIsDetailModalOpen(true)
  }, [])

  const handleDetailModalClose = useCallback(() => {
    setIsDetailModalOpen(false)
    setSelectedItem(null)
  }, [])

  const handleDetailRefreshData = useCallback(async () => {
    await onRefreshData()
  }, [onRefreshData])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] w-[90vw] flex flex-col">
        <DialogHeader className="sticky top-0 z-20">
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            チェック履歴
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col flex-1 min-h-0">
          <TabsList className="grid w-full grid-cols-2 sticky top-[48px] z-10">
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
          
          <TabsContent value="pending" className="mt-4 flex flex-1 min-h-0">
            <ScrollArea className="flex-1">
              <div className="pr-6">
                {sortedPending.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">未完了の履歴はありません</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {sortedPending.map((item, index) => (
                      <NotificationItem
                        key={item.id}
                        item={item}
                        showCompleteButton={!isCompleting}
                        onComplete={handleComplete}
                        onItemClick={handleItemClick}
                        isLast={index === sortedPending.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
              <ScrollBar />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="completed" className="mt-4 flex flex-1 min-h-0">
            <ScrollArea className="flex-1">
              <div className="pr-6">
                {sortedCompleted.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">完了済みの履歴はありません</p>
                  </div>
                ) : (
                  <div className="space-y-0">
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
                )}
              </div>
              <ScrollBar />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      {/* 詳細モーダル */}
      <HistoryDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleDetailModalClose}
        historyItem={selectedItem}
        onRefreshData={handleDetailRefreshData}
      />
    </Dialog>
  )
}
