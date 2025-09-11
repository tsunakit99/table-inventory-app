'use client'

import { useCallback, memo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils/tailwind'
import { useLongPress } from '@/lib/hooks/useLongPress'
import { Category } from '@/types/categories'

export type { Category }

interface CategoryTabsProps {
  categories: Category[]
  selectedCategoryId?: string
  onCategoryChange?: (categoryId: string) => void
  onAddCategory?: () => void
  onDeleteCategory?: (categoryId: string) => void
  className?: string
}

const CategoryButton = memo(function CategoryButton({ 
  category, 
  isSelected, 
  onClick,
  onDelete
}: { 
  category: Category | 'all', 
  isSelected: boolean, 
  onClick: () => void,
  onDelete?: (categoryId: string) => void
}) {
  const handleLongPress = useCallback(() => {
    // 長押し処理は useLongPress フックで管理
  }, [])

  const handleDeleteClick = useCallback(() => {
    if (category !== 'all' && onDelete) {
      onDelete(category.id)
    }
  }, [category, onDelete])

  const longPress = useLongPress({
    onLongPress: handleLongPress,
    onClick,
    disabled: category === 'all' || !onDelete
  })

  const handleDropdownClose = useCallback((open: boolean) => {
    if (!open) {
      longPress.reset()
    }
  }, [longPress])

  if (category !== 'all' && onDelete && longPress.isLongPressed) {
    return (
      <DropdownMenu open={longPress.isLongPressed} onOpenChange={handleDropdownClose}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isSelected ? "default" : "secondary"}
            size="sm"
            className={cn(
              "rounded-full whitespace-nowrap",
              isSelected ? "bg-[#0C1E7D] text-white hover:opacity-80" : "",
              longPress.isPressed && "opacity-70 scale-95" // 視覚的フィードバック
            )}
          >
            {category.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            カテゴリを削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      variant={isSelected ? "default" : "secondary"}
      size="sm"
      {...longPress.handlers}
      className={cn(
        "rounded-full whitespace-nowrap transition-all",
        isSelected ? "bg-[#0C1E7D] text-white hover:opacity-80" : "",
        longPress.isPressed && "opacity-70 scale-95" // 押下状態の視覚的フィードバック
      )}
    >
      {category === 'all' ? 'すべて' : category.name}
    </Button>
  )
})

export const CategoryTabs = memo(function CategoryTabs({
  categories,
  selectedCategoryId,
  onCategoryChange,
  onAddCategory,
  onDeleteCategory,
  className
}: CategoryTabsProps) {

  return (
    <div className={cn("w-full", className)}>
      <ScrollArea className="w-full">
        <div className="flex space-x-2 px-4 py-3 min-w-max">
          {/* 全体カテゴリ */}
          <CategoryButton
            category="all"
            isSelected={selectedCategoryId === 'all' || !selectedCategoryId}
            onClick={() => onCategoryChange?.('all')}
          />
          
          {/* カテゴリタブ */}
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={selectedCategoryId === category.id}
              onClick={() => onCategoryChange?.(category.id)}
              onDelete={onDeleteCategory}
            />
          ))}

          {/* 追加ボタン */}
          <Button
            variant="outline"
            size="sm"
            onClick={onAddCategory}
            className="rounded-full aspect-square p-0 w-8 h-8 flex items-center justify-center"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
})
