export interface Category {
  id: string
  name: string
  color: string
  user_id: string
  created_at: string
}

export interface GiltItem {
  id: string
  name: string
  description: string | null
  isin: string | null
  issuer: string | null
  face_value: number | null
  current_value: number | null
  purchase_date: string | null
  maturity_date: string | null
  coupon_rate: number | null
  category_id: string | null
  user_id: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface PriceHistory {
  id: string
  gilt_item_id: string
  price: number
  recorded_at: string
}

export interface GiltItemInsert {
  name: string
  description?: string | null
  isin?: string | null
  issuer?: string | null
  face_value?: number | null
  current_value?: number | null
  purchase_date?: string | null
  maturity_date?: string | null
  coupon_rate?: number | null
  category_id?: string | null
}

export interface CategoryInsert {
  name: string
  color?: string
}
