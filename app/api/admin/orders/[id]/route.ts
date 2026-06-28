import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { sendShippingConfirmationEmail } from "@/lib/email";
import type { OrderUpdate } from "@/lib/database.types";

const schema = z.object({
  order_status:    z.enum(["paid", "preparing", "shipped", "completed", "canceled", "refunded"]),
  carrier_name:    z.string().optional(),
  tracking_number: z.string().optional(),
  tracking_url:    z.string().url().optional().or(z.literal("")),
});

function isAuthorized(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("x-admin-secret") === secret;
}

/**
 * PATCH /api/admin/orders/[id]
 * Changer le statut d'une commande.
 * Si order_status = "shipped" → envoyer l'email d'expédition.
 * Protégé par header x-admin-secret.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { order_status, carrier_name, tracking_number, tracking_url } = parsed.data;

  // Récupérer la commande actuelle
  const { data: existing, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  }

  // Mise à jour
  const updatePayload: OrderUpdate = { order_status };
  if (carrier_name)    updatePayload.carrier_name    = carrier_name;
  if (tracking_number) updatePayload.tracking_number = tracking_number;
  if (tracking_url)    updatePayload.tracking_url    = tracking_url;
  if (order_status === "shipped") updatePayload.shipped_at = new Date().toISOString();

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: "Erreur mise à jour." }, { status: 500 });
  }

  // Log
  await supabase.from("order_events").insert({
    order_id:   id,
    event_type: "status_changed",
    payload:    { from: existing.order_status, to: order_status },
  });

  // Email expédition (anti-doublon)
  if (order_status === "shipped" && !existing.shipping_email_sent_at) {
    await sendShippingConfirmationEmail(updated);
    await supabase
      .from("orders")
      .update({ shipping_email_sent_at: new Date().toISOString() })
      .eq("id", id);
    await supabase.from("order_events").insert({
      order_id: id, event_type: "email_shipping_sent", payload: null,
    });
  }

  return NextResponse.json({ order: updated });
}

/** GET /api/admin/orders/[id] — détails complets d'une commande */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await params;
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "Introuvable." }, { status: 404 });
  return NextResponse.json({ order: data });
}
