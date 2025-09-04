'use client'

import { CheckCircle, AlertTriangle, AlertCircle, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export interface CheckHistoryItem {
  id: string
  productName: string
  status: 'YELLOW' | 'RED' | 'NONE'
  checkedAt: Date
  quantity?: number
  note?: string
  userName?: string
}

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  checkHistory: CheckHistoryItem[]
}

export function NotificationModal({
  isOpen,
  onClose,
  checkHistory
}: NotificationModalProps) {
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

  const sortedHistory = [...checkHistory].sort(
    (a, b) => b.checkedAt.getTime() - a.checkedAt.getTime()
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            チェック履歴
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          {sortedHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">履歴がありません</p>
            </div>
          ) : (
            <div className="space-y-0">
              {sortedHistory.map((item, index) => (
                <div 
                  key={item.id}
                  className={cn(
                    "flex flex-col gap-2 p-4 transition-colors hover:bg-muted/50",
                    index !== sortedHistory.length - 1 && "border-b"
                  )}
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
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDateTime(item.checkedAt)}
                    </div>
                  </div>
                  {item.note && (
                    <p className="text-sm text-muted-foreground">
                      {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
