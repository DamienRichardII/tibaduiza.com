-- ─────────────────────────────────────────────────────────────────────────────
-- tibaduiza.com — Schéma Supabase
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Types ────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending','paid','failed','canceled','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending','paid','preparing','shipped','completed','canceled','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE delivery_mode AS ENUM ('domicile','main-propre');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Table orders ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  -- Identifiants
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number                TEXT UNIQUE NOT NULL,

  -- Client
  customer_first_name         TEXT NOT NULL,
  customer_last_name          TEXT NOT NULL,
  customer_email              TEXT NOT NULL,
  customer_phone              TEXT,

  -- Mode de livraison
  delivery_mode               delivery_mode NOT NULL DEFAULT 'domicile',

  -- Destinataire livraison
  shipping_first_name         TEXT NOT NULL,
  shipping_last_name          TEXT NOT NULL,
  shipping_address_line1      TEXT,
  shipping_address_line2      TEXT,
  shipping_postal_code        TEXT,
  shipping_city               TEXT,
  shipping_country            TEXT DEFAULT 'France',

  -- Transporteur & suivi
  carrier_name                TEXT,
  tracking_number             TEXT,
  tracking_url                TEXT,
  shipped_at                  TIMESTAMPTZ,
  delivered_at                TIMESTAMPTZ,

  -- Produit
  product_name                TEXT NOT NULL DEFAULT 'Tierra de gigantes — Livre photo',
  product_price               INTEGER NOT NULL DEFAULT 4500,   -- centimes
  quantity                    INTEGER NOT NULL DEFAULT 1,
  total_amount                INTEGER NOT NULL,                -- centimes
  currency                    TEXT NOT NULL DEFAULT 'eur',

  -- Stripe
  stripe_checkout_session_id  TEXT UNIQUE,
  stripe_payment_intent_id    TEXT,
  stripe_receipt_url          TEXT,

  -- Statuts
  payment_status              payment_status NOT NULL DEFAULT 'pending',
  order_status                order_status   NOT NULL DEFAULT 'pending',

  -- Facture (Phase 2)
  invoice_number              TEXT,
  invoice_url                 TEXT,

  -- Anti-doublon emails
  customer_email_sent_at      TIMESTAMPTZ,
  admin_email_sent_at         TIMESTAMPTZ,
  shipping_email_sent_at      TIMESTAMPTZ,
  refund_email_sent_at        TIMESTAMPTZ,

  -- Timestamps
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Table order_events (audit log) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  payload     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Index ────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_email           ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_status    ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status  ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session  ON orders(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_order_events_order_id  ON order_events(order_id);

-- ── Trigger updated_at automatique ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── RLS (Row Level Security) ─────────────────────────────────────────────────
-- Les tables ne sont accessibles que via la service_role (backend).
-- Aucun accès public direct.
ALTER TABLE orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;

-- Seul le service role peut tout faire (utilisé par nos API Routes)
CREATE POLICY "service_role_orders"
  ON orders FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_order_events"
  ON order_events FOR ALL
  USING (true)
  WITH CHECK (true);
