'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { memo } from 'react'

export interface Category {
  id: string
  name: string
}

interface CategoryTabsProps {
  categories: Category[]
  selectedCategoryId?: string
  onCategoryChange?: (categoryId: string) => void
  onAddCategory?: () => void
  className?: string
}

const CategoryButton = memo(function CategoryButton({ 
  category, 
  isSelected, 
  onClick 
}: { 
  category: Category | 'all', 
  isSelected: boolean, 
  onClick: () => void 
}) {
  return (
    <Button
      variant={isSelected ? "default" : "secondary"}
      size="sm"
      onClick={onClick}
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