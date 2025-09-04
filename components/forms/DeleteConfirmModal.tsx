'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  productName: string
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  productName
}: DeleteConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            商品を削除
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            「<span className="font-medium text-foreground">{productName}</span>」を削除しますか？
          </p>
          <p className="text-xs text-muted-foreground">
            この操作は取り消すことができません。
          </p>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirm}>
              削除
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}