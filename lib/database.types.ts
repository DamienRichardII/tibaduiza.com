export type PaymentStatus = "pending" | "paid" | "failed" | "canceled" | "refunded";
export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "completed"
  | "canceled"
  | "refunded";
export type DeliveryMode = "domicile" | "main-propre";

export interface Order {
  id: string;
  order_number: string;

  // Client
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string | null;

  // Livraison
  delivery_mode: DeliveryMode;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_postal_code: string | null;
  shipping_city: string | null;
  shipping_country: string | null;

  // Transporteur & suivi
  carrier_name: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  shipped_at: string | null;
  delivered_at: string | null;

  // Produit
  product_name: string;
  product_price: number;    // centimes
  quantity: number;
  total_amount: number;     // centimes
  currency: string;

  // Stripe
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_receipt_url: string | null;

  // Statuts
  payment_status: PaymentStatus;
  order_status: OrderStatus;

  // Facture
  invoice_number: string | null;
  invoice_url: string | null;

  // Timestamps emails (anti-doublon)
  customer_email_sent_at: string | null;
  admin_email_sent_at: string | null;
  shipping_email_sent_at: string | null;
  refund_email_sent_at: string | null;

  created_at: string;
  updated_at: string;
}

export type OrderInsert = Omit<Order, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type OrderUpdate = Partial<OrderInsert>;

interface OrderEventRow {
  id: string;
  order_id: string;
  event_type: string;
  payload: Record<string, unknown> | null;
  created_at: string;
}

interface OrderEventInsert {
  id?: string;
  order_id: string;
  event_type: string;
  payload?: Record<string, unknown> | null;
  created_at?: string;
}

// ── Type Database complet — respecte la contrainte GenericSchema de Supabase ──
// GenericSchema exige : Tables, Views, Functions sur le schéma public.
// GenericTable exige : Row, Insert, Update, Relationships sur chaque table.
export interface Database {
  public: {
    Tables: {
      orders: {
        Row: Order;
        Insert: OrderInsert;
        Update: OrderUpdate;
        Relationships: [];
      };
      order_events: {
        Row: OrderEventRow;
        Insert: OrderEventInsert;
        Update: Partial<OrderEventInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      payment_status: PaymentStatus;
      order_status: OrderStatus;
      delivery_mode: DeliveryMode;
    };
  };
}
