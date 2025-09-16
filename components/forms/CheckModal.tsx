'use client'

import { memo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { checkSchema, CheckFormData } from '@/lib/validations/forms'
import { handleFormError, showSuccess } from '@/lib/utils/error-handler'

interface CheckModalProps {
  isOpen: boolean
  productName: string
  currentStatus: CheckStatus
  onClose: () => void
  onSubmit: (data: {
    status: 'YELLOW' | 'RED'
    quantity?: number
    note?: string
  }) => Promise<void>
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


export const CheckModal = memo(function CheckModal({
  isOpen,
  productName,
  onClose,
  onSubmit
}: CheckModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm({
    resolver: zodResolver(checkSchema),
    defaultValues: {
      status: 'YELLOW' as const,
      quantity: undefined,
      note: ''
    }
  })

  const onFormSubmit = async (data: CheckFormData) => {
    try {
      await onSubmit({
        status: data.status,
        quantity: data.quantity,
        note: data.note
      })
      showSuccess('在庫情報を登録しました')
      reset()
      onClose()
    } catch (error) {
      handleFormError(error, 'check-submit', setError)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose()
    }
  }



  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>在庫チェック</DialogTitle>
          <DialogDescription>
            {productName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* チェック状態選択 */}
          <fieldset>
            <legend className="text-base font-medium">チェック状態</legend>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <>
                    {(['YELLOW', 'RED'] as const).map((status) => (
                      <StatusButton
                        key={status}
                        status={status}
                        isSelected={field.value === status}
                        onClick={() => field.onChange(status)}
                      />
                    ))}
                  </>
                )}
              />
            </div>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
            )}
          </fieldset>

          {/* 個数入力 */}
          <div>
            <Label htmlFor="quantity">現在の個数（任意）</Label>
            <Input
              type="number"
              id="quantity"
              {...register('quantity', {
                setValueAs: (value) => value === '' ? undefined : Number(value)
              })}
              min="0"
              placeholder="個数を入力"
              className="mt-2"
              aria-invalid={errors.quantity ? 'true' : 'false'}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>
            )}
          </div>

          {/* 備考入力 */}
          <div>
            <Label htmlFor="note">備考（任意）</Label>
            <Textarea
              id="note"
              {...register('note')}
              rows={3}
              placeholder="詳細な状況を記録..."
              className="mt-2 resize-none"
              aria-invalid={errors.note ? 'true' : 'false'}
            />
            {errors.note && (
              <p className="text-sm text-red-500 mt-1">{errors.note.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="text-sm text-red-500">{errors.root.message}</p>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '登録中...' : '登録'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
})
