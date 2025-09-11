'use client'

import { useState, useCallback, memo } from 'react'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils/tailwind'
import { CheckStatus } from '@/types/database'

interface CheckModalProps {
  isOpen: boolean
  productName: string
  currentStatus: CheckStatus
  onClose: () => void
  onSubmit: (data: {
    status: 'YELLOW' | 'RED'
    quantity?: number
    note?: string
  }) => void
}

const StatusButton = memo(function StatusButton({ 
  status, 
  isSelected, 
  onClick 
}: { 
  status: 'YELLOW' | 'RED', 
  isSelected: boolean, 
  onClick: () => void 
}) {
  let icon, text, selectedClassName
  
  switch (status) {
    case 'YELLOW':
      icon = <AlertTriangle className="h-6 w-6" />
      text = '要注意'
      selectedClassName = "bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
      break
    case 'RED':
      icon = <AlertCircle className="h-6 w-6" />
      text = '緊急'
      selectedClassName = "bg-red-50 border-red-300 text-red-800 hover:bg-red-100"
      break
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={cn(
        "h-auto p-3 flex flex-col items-center gap-2",
        isSelected ? selectedClassName : "bg-muted hover:bg-muted/80"
      )}
    >
      {icon}
      <span className="text-xs font-medium">{text}</span>
    </Button>
  )
})

const QuantityInput = memo(function QuantityInput({ 
  value, 
  onChange 
}: { 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
}) {
  return (
    <div>
      <Label htmlFor="quantity">現在の個数（任意）</Label>
      <Input
        type="number"
        id="quantity"
        name="quantity"
        value={value}
        onChange={onChange}
        min="0"
        placeholder="個数を入力"
        className="mt-2"
      />
    </div>
  )
})

const NoteTextarea = memo(function NoteTextarea({ 
  value, 
  onChange 
}: { 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void 
}) {
  return (
    <div>
      <Label htmlFor="note">備考（任意）</Label>
      <Textarea
        id="note"
        name="note"
        value={value}
        onChange={onChange}
        rows={3}
        placeholder="詳細な状況を記録..."
        className="mt-2 resize-none"
      />
    </div>
  )
})

export const CheckModal = memo(function CheckModal({
  isOpen,
  productName,
  currentStatus,
  onClose,
  onSubmit
}: CheckModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<'YELLOW' | 'RED'>('YELLOW')
  const [quantity, setQuantity] = useState<string>('')
  const [note, setNote] = useState('')

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      status: selectedStatus,
      quantity: quantity ? parseInt(quantity) : undefined,
      note: note.trim() || undefined
    })
    // リセット
    setQuantity('')
    setNote('')
  }, [selectedStatus, quantity, note, onSubmit])

  const handleClose = useCallback(() => {
    setQuantity('')
    setNote('')
    onClose()
  }, [onClose])

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      handleClose()
    }
  }, [handleClose])

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value)
  }, [])

  const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value)
  }, [])


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>在庫チェック</DialogTitle>
          <DialogDescription>
            {productName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* チェック状態選択 */}
          <fieldset>
            <legend className="text-base font-medium">チェック状態</legend>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {(['YELLOW', 'RED'] as const).map((status) => (
                <StatusButton
                  key={status}
                  status={status}
                  isSelected={selectedStatus === status}
                  onClick={() => setSelectedStatus(status)}
                />
              ))}
            </div>
          </fieldset>

          {/* 個数入力 */}
          <QuantityInput value={quantity} onChange={handleQuantityChange} />

          {/* 備考入力 */}
          <NoteTextarea value={note} onChange={handleNoteChange} />

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              キャンセル
            </Button>
            <Button type="submit">
              登録
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
})
