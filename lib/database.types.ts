// ─────────────────────────────────────────────────────────────────────────────
// Types générés manuellement dans le format exact du Supabase CLI
// (Views, Functions, CompositeTypes en { [_ in never]: never }, Enums propres)
// ─────────────────────────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          order_number: string
          customer_first_name: string
          customer_last_name: string
          customer_email: string
          customer_phone: string | null
          delivery_mode: Database["public"]["Enums"]["delivery_mode"]
          shipping_first_name: string
          shipping_last_name: string
          shipping_address_line1: string | null
          shipping_address_line2: string | null
          shipping_postal_code: string | null
          shipping_city: string | null
          shipping_country: string | null
          carrier_name: string | null
          tracking_number: string | null
          tracking_url: string | null
          shipped_at: string | null
          delivered_at: string | null
          product_name: string
          product_price: number
          quantity: number
          total_amount: number
          currency: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          stripe_receipt_url: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          order_status: Database["public"]["Enums"]["order_status"]
          invoice_number: string | null
          invoice_url: string | null
          customer_email_sent_at: string | null
          admin_email_sent_at: string | null
          shipping_email_sent_at: string | null
          refund_email_sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_first_name: string
          customer_last_name: string
          customer_email: string
          customer_phone?: string | null
          delivery_mode?: Database["public"]["Enums"]["delivery_mode"]
          shipping_first_name: string
          shipping_last_name: string
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_postal_code?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          carrier_name?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          product_name?: string
          product_price?: number
          quantity?: number
          total_amount: number
          currency?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_receipt_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          order_status?: Database["public"]["Enums"]["order_status"]
          invoice_number?: string | null
          invoice_url?: string | null
          customer_email_sent_at?: string | null
          admin_email_sent_at?: string | null
          shipping_email_sent_at?: string | null
          refund_email_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_first_name?: string
          customer_last_name?: string
          customer_email?: string
          customer_phone?: string | null
          delivery_mode?: Database["public"]["Enums"]["delivery_mode"]
          shipping_first_name?: string
          shipping_last_name?: string
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_postal_code?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          carrier_name?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          product_name?: string
          product_price?: number
          quantity?: number
          total_amount?: number
          currency?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_receipt_url?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          order_status?: Database["public"]["Enums"]["order_status"]
          invoice_number?: string | null
          invoice_url?: string | null
          customer_email_sent_at?: string | null
          admin_email_sent_at?: string | null
          shipping_email_sent_at?: string | null
          refund_email_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_events: {
        Row: {
          id: string
          order_id: string
          event_type: string
          payload: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          event_type: string
          payload?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          event_type?: string
          payload?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      delivery_mode: "domicile" | "main-propre"
      order_status:
        | "canceled"
        | "completed"
        | "paid"
        | "pending"
        | "preparing"
        | "refunded"
        | "shipped"
      payment_status: "canceled" | "failed" | "paid" | "pending" | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Types utilitaires dérivés du type Database
// ─────────────────────────────────────────────────────────────────────────────

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]

// ─────────────────────────────────────────────────────────────────────────────
// Types nommés pour usage dans le code applicatif
// ─────────────────────────────────────────────────────────────────────────────

export type Order = Tables<"orders">
export type OrderInsert = TablesInsert<"orders">
export type OrderUpdate = TablesUpdate<"orders">

export type PaymentStatus = Enums<"payment_status">
export type OrderStatus = Enums<"order_status">
export type DeliveryMode = Enums<"delivery_mode">
