import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripeClient, LIVRE_PRICE_CENTS, LIVRE_CURRENCY, LIVRE_NAME } from "@/lib/stripe";
import { getSupabaseClient, generateOrderNumber } from "@/lib/supabase";
import type { Order } from "@/lib/database.types";

// Force le runtime Node.js — Stripe SDK n'est pas compatible avec Edge Runtime
export const runtime = "nodejs";

// Force le rendu dynamique — empêche Next.js de pré-rendre cette route au build
export const dynamic = "force-dynamic";

/** Schéma de validation Zod — validation stricte côté serveur */
const schema = z
  .object({
    firstName:    z.string().min(2, "Prénom requis (min 2 caractères)"),
    lastName:     z.string().min(2, "Nom requis (min 2 caractères)"),
    email:        z.string().email("Adresse email invalide"),
    phone:        z.string().optional(),
    deliveryMode: z.enum(["domicile", "main-propre"]),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    postalCode:   z.string().optional(),
    city:         z.string().optional(),
    country:      z.string().optional(),
  })
  .refine(
    (d) =>
      d.deliveryMode === "main-propre" ||
      (d.addressLine1 && d.addressLine1.length >= 5 &&
       d.postalCode   && d.postalCode.length >= 4 &&
       d.city         && d.city.length >= 2),
    {
      message: "Adresse de livraison incomplète (adresse, code postal et ville obligatoires)",
      path: ["addressLine1"],
    }
  );

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tibaduizaeli.com";

export async function POST(req: Request) {
  // ── 0. Vérification des variables d'environnement ─────────────────────────
  const missingVars: string[] = [];
  if (!process.env.SUPABASE_URL)              missingVars.push("SUPABASE_URL");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!process.env.STRIPE_SECRET_KEY)         missingVars.push("STRIPE_SECRET_KEY");

  if (missingVars.length > 0) {
    console.error("[checkout] Variables d'environnement manquantes :", missingVars.join(", "));
    // On expose les NOMS des variables manquantes (jamais leurs valeurs)
    return NextResponse.json(
      { error: "Configuration serveur incomplète.", code: "MISSING_ENV_VARS", missing: missingVars },
      { status: 500 }
    );
  }

  // ── 1. Validation du payload ───────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    console.error("[checkout] Body JSON invalide");
    return NextResponse.json(
      { error: "Corps de requête invalide.", code: "INVALID_JSON" },
      { status: 400 }
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    console.log("[checkout] Validation échouée :", JSON.stringify(errors));
    return NextResponse.json(
      { error: "Données invalides.", details: errors },
      { status: 400 }
    );
  }

  const data = parsed.data;
  console.log("[checkout] Payload valide — mode:", data.deliveryMode, "email:", data.email);

  // ── 2. Création de la commande en BDD ─────────────────────────────────────
  console.log("[checkout] Étape 2 — Insertion commande Supabase...");
  const orderNumber = generateOrderNumber();
  let createdOrder: Order;

  try {
    const supabase = getSupabaseClient();
    const { data: insertedOrder, error: dbError } = await supabase
      .from("orders")
      .insert({
        order_number:           orderNumber,
        customer_first_name:    data.firstName,
        customer_last_name:     data.lastName,
        customer_email:         data.email,
        customer_phone:         data.phone ?? null,
        delivery_mode:          data.deliveryMode,
        shipping_first_name:    data.firstName,
        shipping_last_name:     data.lastName,
        shipping_address_line1: data.addressLine1 ?? null,
        shipping_address_line2: data.addressLine2 ?? null,
        shipping_postal_code:   data.postalCode   ?? null,
        shipping_city:          data.city         ?? null,
        shipping_country:       data.deliveryMode === "domicile"
                                  ? (data.country ?? "France")
                                  : null,
        product_name:           LIVRE_NAME,
        product_price:          LIVRE_PRICE_CENTS,
        quantity:               1,
        total_amount:           LIVRE_PRICE_CENTS,
        currency:               LIVRE_CURRENCY,
        payment_status:         "pending",
        order_status:           "pending",
      })
      .select()
      .single();

    if (dbError || !insertedOrder) {
      console.error("[checkout] ERREUR Supabase insert :", JSON.stringify(dbError));
      return NextResponse.json(
        { error: "Impossible de créer la commande.", code: "ORDER_INSERT_FAILED" },
        { status: 500 }
      );
    }

    createdOrder = insertedOrder;
    console.log("[checkout] Commande créée — id:", createdOrder.id, "n°:", createdOrder.order_number);
  } catch (err) {
    console.error("[checkout] Exception Supabase :", err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: "Erreur base de données.", code: "DB_EXCEPTION" },
      { status: 500 }
    );
  }

  // ── 3. Création de la session Stripe Checkout ──────────────────────────────
  console.log("[checkout] Étape 3 — Création session Stripe...");
  let checkoutUrl: string;

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode:           "payment",
      customer_email: data.email,
      line_items: [
        {
          price_data: {
            currency:     LIVRE_CURRENCY,
            unit_amount:  LIVRE_PRICE_CENTS,   // ⚠️ prix toujours fixé côté serveur
            product_data: {
              name:        LIVRE_NAME,
              description: "Format A5 — 140 pages — Précommande",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_id:       createdOrder.id,
        order_number:   orderNumber,
        customer_email: data.email,
        delivery_mode:  data.deliveryMode,
        product_name:   LIVRE_NAME,
      },
      success_url: `${SITE_URL}/boutique/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${SITE_URL}/boutique/commande/annulation`,
      payment_intent_data: {
        metadata: {
          order_id:     createdOrder.id,
          order_number: orderNumber,
        },
      },
    });

    if (!session.url) {
      console.error("[checkout] Stripe session sans URL — id:", session.id);
      return NextResponse.json(
        { error: "Session Stripe invalide (pas d'URL).", code: "STRIPE_NO_URL" },
        { status: 500 }
      );
    }

    checkoutUrl = session.url;
    console.log("[checkout] Session Stripe créée — id:", session.id);

    // ── 4. Stocker l'ID de session Stripe (non bloquant) ──────────────────────
    try {
      const supabase = getSupabaseClient();
      await supabase
        .from("orders")
        .update({ stripe_checkout_session_id: session.id })
        .eq("id", createdOrder.id);

      await supabase.from("order_events").insert({
        order_id:   createdOrder.id,
        event_type: "checkout_session_created",
        payload:    { session_id: session.id, order_number: orderNumber },
      });
    } catch (logErr) {
      // Non bloquant — la session Stripe est créée, on peut continuer
      console.warn(
        "[checkout] Impossible de logger la session Stripe :",
        logErr instanceof Error ? logErr.message : String(logErr)
      );
    }

  } catch (err) {
    // Logs détaillés côté serveur uniquement — jamais exposés au client
    if (err && typeof err === "object") {
      const e = err as {
        type?: string; code?: string; statusCode?: number;
        requestId?: string; message?: string; raw?: { message?: string };
      };
      console.error("[checkout] ERREUR Stripe détaillée", {
        type:       e.type,
        code:       e.code,
        statusCode: e.statusCode,
        requestId:  e.requestId,
        message:    e.message,
        rawMessage: e.raw?.message,
      });
    } else {
      console.error("[checkout] ERREUR Stripe :", String(err));
    }

    // Annuler la commande orpheline (Supabase OK, Stripe KO)
    try {
      const supabase = getSupabaseClient();
      await supabase
        .from("orders")
        .update({ order_status: "canceled", payment_status: "failed" })
        .eq("id", createdOrder.id);
      console.log("[checkout] Commande orpheline annulée —", createdOrder.order_number);
    } catch (cancelErr) {
      console.warn(
        "[checkout] Impossible d'annuler la commande orpheline :",
        cancelErr instanceof Error ? cancelErr.message : String(cancelErr)
      );
    }

    return NextResponse.json(
      {
        error: "Le paiement n'a pas pu être initialisé. Veuillez réessayer dans quelques instants.",
        code:  "STRIPE_SESSION_FAILED",
      },
      { status: 500 }
    );
  }

  console.log("[checkout] ✓ Checkout prêt — redirection vers Stripe");
  return NextResponse.json({ url: checkoutUrl });
}
