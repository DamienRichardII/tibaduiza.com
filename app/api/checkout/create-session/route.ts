import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe, LIVRE_PRICE_CENTS, LIVRE_CURRENCY, LIVRE_NAME } from "@/lib/stripe";
import { supabase, generateOrderNumber } from "@/lib/supabase";

/** Schéma de validation Zod — validation stricte côté serveur */
const schema = z.object({
  firstName:    z.string().min(2, "Prénom requis"),
  lastName:     z.string().min(2, "Nom requis"),
  email:        z.string().email("Email invalide"),
  phone:        z.string().optional(),
  deliveryMode: z.enum(["domicile", "main-propre"]),
  // Adresse : obligatoire si livraison domicile
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  postalCode:   z.string().optional(),
  city:         z.string().optional(),
  country:      z.string().optional(),
}).refine(
  (d) =>
    d.deliveryMode === "main-propre" ||
    (d.addressLine1 && d.addressLine1.length >= 5 &&
     d.postalCode   && d.postalCode.length >= 4 &&
     d.city         && d.city.length >= 2),
  {
    message: "Adresse de livraison incomplète",
    path: ["addressLine1"],
  }
);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tibaduizaeli.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: "Données invalides", details: errors }, { status: 400 });
    }

    const data = parsed.data;
    const orderNumber = generateOrderNumber();

    // ── 1. Créer la commande en BDD (statut pending) ──────────────────────
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        order_number:         orderNumber,
        customer_first_name:  data.firstName,
        customer_last_name:   data.lastName,
        customer_email:       data.email,
        customer_phone:       data.phone ?? null,
        delivery_mode:        data.deliveryMode,
        shipping_first_name:  data.firstName,
        shipping_last_name:   data.lastName,
        shipping_address_line1: data.addressLine1 ?? null,
        shipping_address_line2: data.addressLine2 ?? null,
        shipping_postal_code: data.postalCode ?? null,
        shipping_city:        data.city ?? null,
        shipping_country:     data.country ?? "France",
        product_name:         LIVRE_NAME,
        product_price:        LIVRE_PRICE_CENTS,
        quantity:             1,
        total_amount:         LIVRE_PRICE_CENTS,
        currency:             LIVRE_CURRENCY,
        payment_status:       "pending",
        order_status:         "pending",
      })
      .select()
      .single();

    if (dbError || !order) {
      console.error("[checkout] Erreur insertion commande", dbError);
      return NextResponse.json({ error: "Erreur lors de la création de la commande." }, { status: 500 });
    }

    // ── 2. Créer la session Stripe Checkout ───────────────────────────────
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.email,
      line_items: [
        {
          price_data: {
            currency: LIVRE_CURRENCY,
            unit_amount: LIVRE_PRICE_CENTS,  // ⚠️ toujours défini côté serveur
            product_data: {
              name: LIVRE_NAME,
              description: "Format A5 — 140 pages — Précommande",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_id:      order.id,
        order_number:  orderNumber,
        customer_email: data.email,
        delivery_mode: data.deliveryMode,
      },
      success_url: `${SITE_URL}/boutique/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${SITE_URL}/boutique/commande/annulation`,
      // Pas de shipping_address_collection car on la collecte dans notre formulaire
      payment_intent_data: {
        metadata: {
          order_id:     order.id,
          order_number: orderNumber,
        },
      },
    });

    // ── 3. Stocker l'ID de session Stripe ────────────────────────────────
    await supabase
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    // ── 4. Log l'événement ───────────────────────────────────────────────
    await supabase.from("order_events").insert({
      order_id:   order.id,
      event_type: "checkout_session_created",
      payload:    { session_id: session.id, order_number: orderNumber },
    });

    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("[checkout] Erreur inattendue", err);
    return NextResponse.json({ error: "Erreur serveur. Veuillez réessayer." }, { status: 500 });
  }
}
