import { Category } from '@/components/features/categories/CategoryTabs'
import { Product } from '@/components/features/products/ProductList'
import { CheckHistoryItem } from '@/components/features/history/NotificationModal'

export const mockCategories: Category[] = [
  { id: '1', name: 'ビール' },
  { id: '2', name: '日本酒' },
  { id: '3', name: 'ワイン' },
  { id: '4', name: 'ウイスキー' },
  { id: '5', name: 'カクテル' },
]

export const mockProducts: Product[] = [
  { id: '1', name: 'サッポロ黒ラベル', check_status: 'NONE', category_id: '1' },
  { id: '2', name: 'アサヒスーパードライ', check_status: 'YELLOW', category_id: '1' },
  { id: '3', name: 'キリン一番搾り', check_status: 'RED', category_id: '1' },
  { id: '4', name: '獺祭 純米大吟醸', check_status: 'NONE', category_id: '2' },
  { id: '5', name: '久保田 千寿', check_status: 'YELLOW', category_id: '2' },
  { id: '6', name: '赤霧島', check_status: 'NONE', category_id: '2' },
  { id: '7', name: 'シャトー・マルゴー', check_status: 'NONE', category_id: '3' },
  { id: '8', name: 'ドンペリニヨン', check_status: 'RED', category_id: '3' },
]

export const mockCheckHistory: CheckHistoryItem[] = [
  {
    id: '1',
    productName: 'ドンペリニヨン',
    status: 'RED',
    checkedAt: new Date(2024, 8, 3, 14, 30),
    quantity: 2,
    note: '在庫が非常に少なくなっています。急ぎ発注が必要です。'
  },
  {
    id: '2', 
    productName: 'アサヒスーパードライ',
    status: 'YELLOW',
    checkedAt: new Date(2024, 8, 3, 10, 15),
    quantity: 8,
    note: '週末に向けて在庫を確認'
  },
  {
    id: '3',
    productName: 'キリン一番搾り',
    status: 'RED', 
    checkedAt: new Date(2024, 8, 2, 18, 45),
    quantity: 1,
    note: '最後の1本です'
  },
  {
    id: '4',
    productName: '久保田 千寿',
    status: 'NONE',
    checkedAt: new Date(2024, 8, 2, 16, 20),
    quantity: 12
  },
  {
    id: '5',
    productName: 'サッポロ黒ラベル',
    status: 'NONE',
    checkedAt: new Date(2024, 8, 2, 9, 10),
    quantity: 24
  }
]