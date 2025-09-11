'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Category } from '@/types/categories'
import { productSchema, ProductFormData } from '@/lib/validations/forms'
import { handleFormError } from '@/lib/utils/error-handler'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (productData: { name: string; categoryId: string }) => Promise<void>
  categories: Category[]
  selectedCategoryId?: string
}

export function AddProductModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  selectedCategoryId
}: AddProductModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setError,
    setValue
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      categoryId: selectedCategoryId || ''
    }
  })

  const onFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit({
        name: data.name,
        categoryId: data.categoryId
      })
      reset()
      onClose()
    } catch (error) {
      handleFormError(error, 'product-add', setError)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  // selectedCategoryIdが変わったときにcategoryIdも更新
  useEffect(() => {
    if (selectedCategoryId) {
      setValue('categoryId', selectedCategoryId)
    }
  }, [selectedCategoryId, setValue])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>商品を追加</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">商品名</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="商品名を入力してください"
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categoryId">カテゴリ</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={errors.categoryId ? 'true' : 'false'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-sm text-red-500 mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="text-sm text-red-500">{errors.root.message}</p>
          )}
          
          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '追加中...' : '追加'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
