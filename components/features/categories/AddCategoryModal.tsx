'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Label } from '@/components/ui/label'
import { categorySchema, CategoryFormData } from '@/lib/validations/forms'
import { handleFormError, showSuccess } from '@/lib/utils/error-handler'

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (categoryName: string) => Promise<void>
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit
}: AddCategoryModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: ''
    }
  })

  const onFormSubmit = async (data: CategoryFormData) => {
    try {
      await onSubmit(data.name)
      showSuccess('カテゴリを追加しました')
      reset()
      onClose()
    } catch (error) {
      handleFormError(error, 'category-add', setError)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新しいカテゴリを追加</DialogTitle>
          <DialogDescription>
            カテゴリ名を入力してください
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">カテゴリ名</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="例：ソフトドリンク"
              className="mt-2"
              autoFocus
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="text-sm text-red-500">{errors.root.message}</p>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              キャンセル
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? '追加中...' : '追加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}