'use client'

import { useState } from 'react'
import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Category } from '@/components/features/categories/CategoryTabs'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (productData: { name: string; categoryId: string }) => void
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
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState(selectedCategoryId || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && categoryId) {
      onSubmit({
        name: name.trim(),
        categoryId
      })
      setName('')
      setCategoryId('')
      onClose()
    }
  }

  const handleClose = () => {
    setName('')
    setCategoryId(selectedCategoryId || '')
    onClose()
  }

  // selectedCategoryIdが変わったときにcategoryIdも更新
  React.useEffect(() => {
    if (selectedCategoryId) {
      setCategoryId(selectedCategoryId)
    }
  }, [selectedCategoryId])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>商品を追加</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">商品名</Label>
            <Input
              id="product-name"
              name="productName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="商品名を入力してください"
              required
            />
          </div>
          
          <div className="space-y-2">
          <Label id="product-category-label">カテゴリ</Label>
          <Select
          value={categoryId}
          onValueChange={setCategoryId}
          required
          aria-labelledby="product-category-label"
          name="categoryId"
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

          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              キャンセル
            </Button>
            <Button type="submit">
              追加
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
