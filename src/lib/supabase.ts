import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  category: string
  active: boolean
  created_at: string
}

export type Order = {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  product_id: string | null
  quantity: number
  total: number | null
  status: 'nuevo' | 'contactado' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado'
  notes: string | null
  source: string
  created_at: string
  products?: { name: string } | null
}

export type InventoryMovement = {
  id: string
  product_id: string
  type: 'entrada' | 'salida'
  quantity: number
  reason: string | null
  created_at: string
  products?: { name: string } | null
}
