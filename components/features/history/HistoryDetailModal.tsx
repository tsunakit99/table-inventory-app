'use client'

import { useState, useCallback } from 'react'
import { AlertTriangle, AlertCircle, CheckCircle, Calendar, Package, FileText, CheckCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils/user'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckHistoryItem } from '@/types/history'
import { completeCheckHistory } from '@/actions/history'

interface HistoryDetailModalProps {
  isOpen: boolean
  onClose: () => void
  historyItem: CheckHistoryItem | null
  onRefreshData: () => Promise<void>
}

export function HistoryDetailModal({
  isOpen,
  onClose,
  historyItem,
  onRefreshData
}: HistoryDetailModalProps) {
  const [isCompleting, setIsCompleting] = useState(false)

  const getStatusIcon = (status: 'YELLOW' | 'RED' | 'NONE') => {
    switch (status) {
      case 'YELLOW':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case 'RED':
        return <AlertCircle className="h-6 w-6 text-red-600" />
      default:
        return <CheckCircle className="h-6 w-6 text-green-600" />
    }
  }

  const getStatusText = (status: 'YELLOW' | 'RED' | 'NONE') => {
    switch (status) {
      case 'YELLOW':
        return '要注意'
      case 'RED':
        return '緊急'
      default:
        return '正常'
    }
  }

  const getStatusColor = (status: 'YELLOW' | 'RED' | 'NONE') => {
    switch (status) {
      case 'YELLOW':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'RED':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-green-100 text-green-800 border-green-300'
    }
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short'
    }).format(date)
  }

  const handleComplete = useCallback(async () => {
    if (!historyItem || historyItem.completionStatus === 'COMPLETED') return
    
    try {
      setIsCompleting(true)
      await completeCheckHistory(historyItem.id)
      await onRefreshData()
      onClose()
    } catch (error) {
      console.error('Failed to complete history:', error)
      alert('完了処理に失敗しました')
    } finally {
      setIsCompleting(false)
    }
  }, [historyItem, onRefreshData, onClose])

  if (!historyItem) {
    return null
  }

  const isPending = historyItem.completionStatus === 'PENDING'
  const showCompleteButton = isPending && !isCompleting

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className="sm:max-w-lg z-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            チェック詳細
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 商品名 */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {historyItem.productName}
            </h2>
            <Badge 
              variant="outline" 
              className={`text-sm px-3 py-1 ${getStatusColor(historyItem.status)}`}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(historyItem.status)}
                {getStatusText(historyItem.status)}
              </div>
            </Badge>
          </div>

          <Separator />

          {/* チェック情報 */}
          <div className="space-y-4">
            {/* チェック日時 */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">チェック日時</p>
                <p className="text-base">{formatDateTime(historyItem.checkedAt)}</p>
                {historyItem.checkerName && (
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={historyItem.checkerAvatarUrl} />
                      <AvatarFallback className="text-[8px]">
                        {getInitials(historyItem.checkerName)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{historyItem.checkerName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 個数情報 */}
            {historyItem.quantity && (
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">個数</p>
                  <p className="text-base font-semibold">{historyItem.quantity}個</p>
                </div>
              </div>
            )}

            {/* 備考 */}
            {historyItem.note && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">備考</p>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {historyItem.note}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 完了情報（完了済みの場合） */}
            {!isPending && historyItem.completedAt && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCheck className="h-5 w-5" />
                    <span className="font-medium">完了済み</span>
                  </div>
                  
                  <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                    <p className="text-sm font-medium text-muted-foreground">完了日時</p>
                    <p className="text-base">{formatDateTime(historyItem.completedAt)}</p>
                  
                    
                    {historyItem.completerName && (
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={historyItem.completerAvatarUrl} />
                          <AvatarFallback className="text-[8px]">
                            {getInitials(historyItem.completerName)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{historyItem.completerName}</span>
                      </div>
                    )}
                    </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {showCompleteButton && (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              閉じる
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={isCompleting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isCompleting ? (
                <>処理中...</>
              ) : (
                <>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  完了する
                </>
              )}
            </Button>
          </DialogFooter>
        )}

        {!showCompleteButton && (
          <DialogFooter>
            <Button onClick={onClose}>
              閉じる
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
