'use client'

import { AlertTriangle, AlertCircle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils/tailwind'
import { useState, memo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/products'
import { CheckStatus } from '@/types/database'

export type { Product }

interface ProductItemProps {
  product: Product
  onCheckClick: (productId: string) => void
  onDeleteClick: (productId: string) => void
  swipeOpenId: string | null
  onSwipeOpen: (productId: string | null) => void
  isLast?: boolean
}

const ProductItem = memo(function ProductItem({ product, onCheckClick, onDeleteClick, swipeOpenId, onSwipeOpen, isLast }: ProductItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  
  // スワイプ状態は親コンポーネントで管理
  const swipeX = swipeOpenId === product.id ? 80 : 0

  const getStatusIcon = (status: CheckStatus) => {
    switch (status) {
      case 'YELLOW':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'RED':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    const touch = e.touches[0]
    const startX = touch.clientX
    let currentSwipeX = 0
    
    const handleTouchMove = (e: TouchEvent) => {
      const currentTouch = e.touches[0]
      const deltaX = currentTouch.clientX - startX
      if (deltaX > 0) {
        currentSwipeX = Math.min(deltaX, 80)
        // 他の商品のスワイプを閉じる
        onSwipeOpen(null)
      }
    }
    
    const handleTouchEnd = () => {
      setIsDragging(false)
      if (currentSwipeX > 40) {
        onSwipeOpen(product.id)
      } else {
        onSwipeOpen(null)
      }
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
    
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteClick(product.id)
    onSwipeOpen(null) // 削除ボタンを閉じる
  }

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Delete Button Background - Left Side */}
      <div 
        className={cn(
          "absolute inset-y-0 left-0 bg-red-500 flex items-center justify-center transition-all duration-200 z-10",
          swipeX > 0 ? "w-20" : "w-0"
        )}
        style={{ 
          width: swipeX > 0 ? '80px' : '0px',
          backgroundColor: swipeX > 0 ? '#ef4444' : 'transparent'
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          className="text-white hover:bg-red-600 h-full w-full"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main Content */}
      <div 
        className={cn(
          "flex items-center justify-between px-4 py-4 transition-all hover:bg-muted/50 cursor-pointer bg-white relative",
          !isLast && "border-b",
          isDragging ? "duration-0" : "duration-200"
        )}
        style={{ transform: `translateX(${swipeX}px)` }}
        onClick={() => !isDragging && onCheckClick(product.id)}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex-1">
          <h3 className="font-medium leading-none">
            {product.name}
          </h3>
        </div>
        
        <div className="ml-4 shrink-0 flex items-center gap-2">
          {/* PC Hover Delete Button */}
          <div className={cn(
            "hidden md:block transition-all duration-200",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
          )}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Status Icon */}
          {product.check_status !== 'NONE' && (
            <div className="flex items-center justify-center">
              {getStatusIcon(product.check_status)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

interface ProductListProps {
  products: Product[]
  onCheckClick: (productId: string) => void
  onDeleteClick: (productId: string) => void
  className?: string
}

interface ProductItemCardProps {
  product: Product
  onCheckClick: (productId: string) => void
  onDeleteClick: (productId: string) => void
}

const ProductItemCard = memo(function ProductItemCard({ product, onCheckClick, onDeleteClick }: ProductItemCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  

  const getStatusIcon = (status: CheckStatus) => {
    switch (status) {
      case 'YELLOW':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'RED':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteClick(product.id)
  }

  return (
    <div 
      className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
      onClick={() => onCheckClick(product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1">
        <h3 className="font-medium leading-none">
          {product.name}
        </h3>
      </div>
      
      <div className="ml-4 shrink-0 flex items-center gap-2">
        {/* Hover Delete Button */}
        <div className={cn(
          "transition-all duration-200",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        )}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Status Icon */}
        {product.check_status !== 'NONE' && (
          <div className="flex items-center justify-center">
            {getStatusIcon(product.check_status)}
          </div>
        )}
      </div>
    </div>
  )
})

export const ProductList = memo(function ProductList({ 
  products, 
  onCheckClick,
  onDeleteClick,
  className 
}: ProductListProps) {
  const [swipeOpenId, setSwipeOpenId] = useState<string | null>(null)
  
  const handleSwipeOpen = useCallback((productId: string | null) => {
    setSwipeOpenId(productId)
  }, [])
  

  if (products.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <p className="text-muted-foreground">商品がありません</p>
      </div>
    )
  }

  return (
    <div className={cn("bg-background", className)}>
      {/* Mobile: Single column, PC: Grid layout */}
      <div className="block md:hidden">
        {products.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            onCheckClick={onCheckClick}
            onDeleteClick={onDeleteClick}
            swipeOpenId={swipeOpenId}
            onSwipeOpen={handleSwipeOpen}
            isLast={index === products.length - 1}
          />
        ))}
      </div>
      
      {/* PC: Grid layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {products.map((product) => (
          <ProductItemCard
            key={product.id}
            product={product}
            onCheckClick={onCheckClick}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>
    </div>
  )
})
