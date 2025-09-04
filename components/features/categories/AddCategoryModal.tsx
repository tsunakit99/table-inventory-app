'use client'

import { useState } from 'react'
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

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (categoryName: string) => void
}

export function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit
}: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (categoryName.trim()) {
      onSubmit(categoryName.trim())
      setCategoryName('')
      onClose()
    }
  }

  const handleClose = () => {
    setCategoryName('')
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="categoryName">カテゴリ名</Label>
            <Input
              id="categoryName"
              name="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="例：ソフトドリンク"
              className="mt-2"
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              キャンセル
            </Button>
            <Button 
              type="submit" 
              disabled={!categoryName.trim()}
            >
              追加
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}