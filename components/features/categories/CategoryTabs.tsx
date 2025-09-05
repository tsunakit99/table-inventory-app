'use client'

import { useState, useCallback, memo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
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
  const [isLongPressActive, setIsLongPressActive] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)

  const handleMouseDown = useCallback(() => {
    if (category === 'all' || !onDelete) return
    
    const timer = setTimeout(() => {
      setIsLongPressActive(true)
    }, 800)
    setLongPressTimer(timer)
  }, [category, onDelete])

  const handleMouseUp = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
    setIsLongPressActive(false)
  }, [longPressTimer])

  const handleTouchStart = useCallback(() => {
    if (category === 'all' || !onDelete) return
    
    const timer = setTimeout(() => {
      setIsLongPressActive(true)
    }, 800)
    setLongPressTimer(timer)
  }, [category, onDelete])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
    if (isLongPressActive) {
      e.preventDefault()
    }
    setIsLongPressActive(false)
  }, [longPressTimer, isLongPressActive])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (category === 'all' || !onDelete) return
    e.preventDefault()
    setIsLongPressActive(true)
  }, [category, onDelete])

  const handleDeleteClick = useCallback(() => {
    if (category !== 'all' && onDelete) {
      onDelete(category.id)
    }
  }, [category, onDelete])

  if (category !== 'all' && onDelete && isLongPressActive) {
    return (
      <DropdownMenu open={isLongPressActive} onOpenChange={setIsLongPressActive}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isSelected ? "default" : "secondary"}
            size="sm"
            className={cn(
              "rounded-full whitespace-nowrap",
              isSelected ? "bg-[#0C1E7D] text-white hover:opacity-80" : ""
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
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleContextMenu}
      className={cn(
        "rounded-full whitespace-nowrap",
        isSelected ? "bg-[#0C1E7D] text-white hover:opacity-80" : ""
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