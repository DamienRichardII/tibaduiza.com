import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/** GET /api/orders/[id] — vérifier une commande après paiement (données publiques uniquement) */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Accepter un ID Supabase (UUID) ou un stripe_checkout_session_id
  const isSessionId = id.startsWith("cs_");

  const query = supabase
    .from("orders")
    .select(
      "id, order_number, product_name, quantity, total_amount, currency, order_status, payment_status, customer_email, delivery_mode, created_at"
    );

  const { data: order, error } = isSessionId
    ? await query.eq("stripe_checkout_session_id", id).single()
    : await query.eq("id", id).single();

  if (error || !order) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  }

  return NextResponse.json({ order });
}
