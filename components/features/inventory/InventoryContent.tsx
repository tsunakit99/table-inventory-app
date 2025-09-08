'use client'

import { memo, useState, useCallback, useMemo, useEffect } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { SideMenu } from '@/components/layout/SideMenu'
import { SearchBar } from '@/components/forms/SearchBar'
import { CategoryTabs } from '@/components/features/categories/CategoryTabs'
import { ProductList } from '@/components/features/products/ProductList'
import { Category } from '@/types/categories'
import { Product } from '@/types/products'
import { CheckModal } from '@/components/forms/CheckModal'
import { AddCategoryModal } from '@/components/features/categories/AddCategoryModal'
import { AddProductModal } from '@/components/features/products/AddProductModal'
import { DeleteConfirmModal } from '@/components/forms/DeleteConfirmModal'
import { NotificationModal } from '@/components/features/history/NotificationModal'
import { CheckHistoryItem } from '@/types/history'
import { updateProductCheck } from '@/actions/inventory'
import { addCategory, deleteCategory } from '@/actions/categories'
import { addProduct, deleteProduct } from '@/actions/products'
import { getUser } from '@/actions/users'
import { CheckStatus } from '@/types/database'
import { Plus } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface Data {
  products: { products: Product[]; totalCount: number }
  notifications: { hasNewNotifications: boolean; notificationCount: number }
  checkHistory: CheckHistoryItem[]
}

interface InventoryContentProps {
  data: Data
  searchQuery: string
  onSearchQuery: (query: string) => void
  selectedCategoryId: string
  onSelectedCategoryId: (id: string) => void
  statusFilters: CheckStatus[]
  onStatusFilters: (filters: CheckStatus[]) => void
  categories: Category[]
  onCategories: (categories: Category[]) => void
  onRefreshData: () => Promise<void>
  isPending: boolean
}

export const InventoryContent = memo(function InventoryContent({
  data,
  onSearchQuery,
  selectedCategoryId,
  onSelectedCategoryId,
  onStatusFilters,
  categories,
  onCategories,
  onRefreshData,
  isPending
}: Omit<InventoryContentProps, 'searchQuery' | 'statusFilters'>) {
  // データを直接使用
  const { products } = data.products
  const notifications = data.notifications
  const checkHistory = data.checkHistory
  
  // ユーザー情報状態
  const [user, setUser] = useState<User | null>(null)
  
  // ユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }
    fetchUser()
  }, [])

  // UI状態管理
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)

  // 通知クリック
  const handleNotificationClick = useCallback(() => {
    setIsNotificationModalOpen(true)
  }, [])

  // サイドメニュー開閉
  const handleMenuClick = useCallback(() => {
    setIsSideMenuOpen(true)
  }, [])

  const handleSideMenuClose = useCallback(() => {
    setIsSideMenuOpen(false)
  }, [])

  // Modal close handlers
  const handleCheckModalClose = useCallback(() => {
    setIsCheckModalOpen(false)
    setSelectedProduct(null)
  }, [])

  const handleNotificationModalClose = useCallback(() => {
    setIsNotificationModalOpen(false)
  }, [])

  const handleAddCategoryModalClose = useCallback(() => {
    setIsAddCategoryModalOpen(false)
  }, [])

  const handleAddProductModalClose = useCallback(() => {
    setIsAddProductModalOpen(false)
  }, [])

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false)
    setProductToDelete(null)
  }, [])

  const handleAddCategoryOpen = useCallback(() => {
    setIsAddCategoryModalOpen(true)
  }, [])

  const handleAddProductOpen = useCallback(() => {
    setIsAddProductModalOpen(true)
  }, [])

  // フローティングボタンのスタイル
  const floatingButtonStyle = useMemo(() => ({ backgroundColor: '#0C1E7D' }), [])

  // チェックボタンクリック
  const handleCheckClick = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setSelectedProduct(product)
      setIsCheckModalOpen(true)
    }
  }, [products])

  // チェック状態更新
  const handleCheckSubmit = useCallback(async (data: {
    status: 'YELLOW' | 'RED'
    quantity?: number
    note?: string
  }) => {
    if (selectedProduct) {
      await updateProductCheck(selectedProduct.id, selectedProduct.name, data)
      setIsCheckModalOpen(false)
      setSelectedProduct(null)
      await onRefreshData()
    }
  }, [selectedProduct, onRefreshData])

  // カテゴリ追加
  const handleAddCategory = useCallback(async (categoryName: string) => {
    const newCategory = await addCategory(categoryName)
    onCategories([...categories, newCategory])
  }, [onCategories, categories])

  // 商品追加
  const handleAddProduct = useCallback(async (productData: { name: string; categoryId: string }) => {
    await addProduct(productData)
    await onRefreshData()
  }, [onRefreshData])

  // 商品削除
  const handleDeleteClick = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setProductToDelete(product)
      setIsDeleteModalOpen(true)
    }
  }, [products])

  const handleDeleteConfirm = useCallback(async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id)
      setIsDeleteModalOpen(false)
      setProductToDelete(null)
      await onRefreshData()
    }
  }, [productToDelete, onRefreshData])

  // カテゴリ削除
  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    try {
      await deleteCategory(categoryId)
      
      // 削除されたカテゴリが選択されていた場合、'all'に切り替え
      if (selectedCategoryId === categoryId) {
        onSelectedCategoryId('all')
      }
      
      // カテゴリリストから削除
      const updatedCategories = categories.filter(cat => cat.id !== categoryId)
      onCategories(updatedCategories)
      
      await onRefreshData()
    } catch (error: unknown) {
      console.error('Failed to delete category:', error)
      const message = error instanceof Error ? error.message : 'カテゴリの削除に失敗しました'
      alert(message)
    }
  }, [categories, selectedCategoryId, onCategories, onSelectedCategoryId, onRefreshData])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader
        hasNewNotifications={notifications.hasNewNotifications}
        notificationCount={notifications.notificationCount}
        onNotificationClick={handleNotificationClick}
        onMenuClick={handleMenuClick}
      />

      <div className="space-y-6">
        {/* 検索バー */}
        <div className="px-4 pt-4">
          <SearchBar 
            placeholder="商品名で検索..."
            onSearch={onSearchQuery}
            onFilterChange={onStatusFilters}
          />
        </div>

        {/* カテゴリータブ */}
        <div className="border-b">
          <CategoryTabs
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={onSelectedCategoryId}
            onAddCategory={handleAddCategoryOpen}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>
        
        {/* 商品リスト */}
        <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
          <ProductList
            products={products}
            onCheckClick={handleCheckClick}
            onDeleteClick={handleDeleteClick}
          />
        </div>
      </div>

      {/* フローティング商品追加ボタン */}
      {selectedCategoryId !== 'all' && (
        <button
          onClick={handleAddProductOpen}
          className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg hover:opacity-80 transition-all flex items-center justify-center z-50"
          style={floatingButtonStyle}
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Side Menu */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={handleSideMenuClose}
        userName={user?.user_metadata?.display_name || 'unknown'}
        userAvatarUrl={user?.user_metadata?.avatar_url || null}
      />

      {/* Modals */}
      {selectedProduct && (
        <CheckModal
          isOpen={isCheckModalOpen}
          productName={selectedProduct.name}
          currentStatus={selectedProduct.check_status}
          onClose={handleCheckModalClose}
          onSubmit={handleCheckSubmit}
        />
      )}

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={handleNotificationModalClose}
        checkHistory={checkHistory}
        onRefreshData={onRefreshData}
      />

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={handleAddCategoryModalClose}
        onSubmit={handleAddCategory}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={handleAddProductModalClose}
        onSubmit={handleAddProduct}
        categories={categories}
        selectedCategoryId={selectedCategoryId !== 'all' ? selectedCategoryId : undefined}
      />

      {productToDelete && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
          onConfirm={handleDeleteConfirm}
          productName={productToDelete.name}
        />
      )}
    </div>
  )
})