import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { getSupabaseClient } from "@/lib/supabase";
import {
  sendOrderConfirmationEmail,
  sendAdminNewOrderEmail,
} from "@/lib/email";
import type Stripe from "stripe";

// App Router : lire le body RAW (requis pour la vérification de signature Stripe)
export const runtime = "nodejs";

// Force le rendu dynamique — empêche Next.js de pré-rendre cette route au build
export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET non configuré");
    return NextResponse.json({ error: "Configuration serveur manquante." }, { status: 500 });
  }

  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  const stripe = getStripeClient();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] Signature invalide", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  // ── Routage des événements ────────────────────────────────────────────
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "checkout.session.expired":
        await handleSessionExpired(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        break;
    }
  } catch (err) {
    // Log l'erreur mais retourner 200 pour éviter les retries Stripe en boucle
    console.error("[webhook] Erreur traitement événement", event.type, err);
  }

  return NextResponse.json({ received: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────────────────────

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;
  if (!orderId) {
    console.error("[webhook] checkout.session.completed — order_id absent");
    return;
  }

  const supabase = getSupabaseClient();

  // ── Vérification idempotency ──────────────────────────────────────────
  const { data: existing } = await supabase
    .from("orders")
    .select("id, payment_status, customer_email_sent_at, admin_email_sent_at")
    .eq("id", orderId)
    .single();

  if (!existing) {
    console.error("[webhook] Commande introuvable", orderId);
    return;
  }

  if (existing.payment_status === "paid") {
    console.log("[webhook] Commande déjà payée, ignoré", orderId);
    return;
  }

  // ── Récupérer le receipt_url depuis le PaymentIntent ─────────────────
  let receiptUrl: string | null = null;
  if (session.payment_intent && typeof session.payment_intent === "string") {
    try {
      const pi = await getStripeClient().paymentIntents.retrieve(session.payment_intent, {
        expand: ["latest_charge"],
      });
      const charge = (pi.latest_charge as Stripe.Charge) ?? null;
      receiptUrl = charge?.receipt_url ?? null;
    } catch {
      // Non bloquant
    }
  }

  // ── Mettre à jour la commande ─────────────────────────────────────────
  const now = new Date().toISOString();
  const { data: order, error: updateError } = await supabase
    .from("orders")
    .update({
      payment_status:            "paid",
      order_status:              "preparing",
      stripe_payment_intent_id:  typeof session.payment_intent === "string"
                                   ? session.payment_intent
                                   : null,
      stripe_receipt_url:        receiptUrl,
    })
    .eq("id", orderId)
    .select()
    .single();

  if (updateError || !order) {
    console.error("[webhook] Erreur update commande", updateError);
    return;
  }

  // Log
  await supabase.from("order_events").insert({
    order_id:   orderId,
    event_type: "payment_confirmed",
    payload:    {
      stripe_session_id: session.id,
      payment_intent_id: typeof session.payment_intent === "string"
                           ? session.payment_intent
                           : null,
    },
  });

  // ── Emails (anti-doublon via champ *_sent_at) ─────────────────────────
  if (!existing.customer_email_sent_at) {
    await sendOrderConfirmationEmail(order);
    await supabase
      .from("orders")
      .update({ customer_email_sent_at: now })
      .eq("id", orderId);
    await supabase.from("order_events").insert({
      order_id: orderId, event_type: "email_confirmation_sent", payload: null,
    });
  }

  if (!existing.admin_email_sent_at) {
    await sendAdminNewOrderEmail(order);
    await supabase
      .from("orders")
      .update({ admin_email_sent_at: now })
      .eq("id", orderId);
    await supabase.from("order_events").insert({
      order_id: orderId, event_type: "email_admin_sent", payload: null,
    });
  }

  console.log("[webhook] Commande payée et emails envoyés", order.order_number);
}

async function handleSessionExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;
  if (!orderId) return;

  const supabase = getSupabaseClient();

  await supabase
    .from("orders")
    .update({ payment_status: "canceled", order_status: "canceled" })
    .eq("id", orderId)
    .eq("payment_status", "pending");

  await supabase.from("order_events").insert({
    order_id:   orderId,
    event_type: "session_expired",
    payload:    { session_id: session.id },
  });
}

async function handlePaymentFailed(pi: Stripe.PaymentIntent) {
  const orderId = pi.metadata?.order_id;
  if (!orderId) return;

  const supabase = getSupabaseClient();

  await supabase
    .from("orders")
    .update({ payment_status: "failed" })
    .eq("id", orderId)
    .eq("payment_status", "pending");

  await supabase.from("order_events").insert({
    order_id:   orderId,
    event_type: "payment_failed",
    payload:    {
      payment_intent_id: pi.id,
      last_error:        pi.last_payment_error?.message ?? null,
    },
  });
}
