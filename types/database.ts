export type CheckStatus = 'NONE' | 'YELLOW' | 'RED'
export type ActionType = 'CHECK_YELLOW' | 'CHECK_RED' | 'UNCHECK'
export type CompletionStatus = 'PENDING' | 'COMPLETED'

export interface Category {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  check_status: CheckStatus
  created_at: string
  updated_at: string
}

export interface CheckHistory {
  id: string
  product_id: string
  action_type: ActionType
  quantity?: number | null
  note?: string | null
  user_id: string
  status: CompletionStatus
  completed_by?: string | null
  completed_at?: string | null
  created_at: string
}

// Relations
export interface ProductWithCategory extends Product {
  category: Category
}

export interface CheckHistoryWithProduct extends CheckHistory {
  product: ProductWithCategory
}

// Form types
export interface CreateCategoryData {
  name: string
}

export interface UpdateCategoryData {
  name: string
}

export interface CreateProductData {
  category_id: string
  name: string
}

export interface UpdateProductData {
  category_id?: string
  name?: string
  check_status?: CheckStatus
}

export interface CreateCheckHistoryData {
  product_id: string
  action_type: ActionType
  quantity?: number
  note?: string
  user_id: string
  status?: CompletionStatus
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
      }
      check_history: {
        Row: CheckHistory
        Insert: Omit<CheckHistory, 'id' | 'created_at'>
        Update: Partial<Omit<CheckHistory, 'id' | 'created_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      check_status: CheckStatus
      action_type: ActionType
      completion_status: CompletionStatus
    }
  }
}