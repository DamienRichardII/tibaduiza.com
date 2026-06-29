import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

// Force le rendu dynamique
export const dynamic = "force-dynamic";

/**
 * GET /api/debug/stripe
 * Route de diagnostic — teste la connectivité Railway/Vercel → Stripe.
 * Protégée par le header x-admin-secret.
 *
 * Usage :
 *   curl -H "x-admin-secret: <ADMIN_SECRET>" https://tibaduizaeli.com/api/debug/stripe
 *
 * ⚠️ À supprimer ou désactiver après diagnostic.
 */
export async function GET(req: Request): Promise<NextResponse> {
  // ── Authentification ─────────────────────────────────────────────────────────
  const adminSecret = process.env.ADMIN_SECRET;
  const provided    = req.headers.get("x-admin-secret");

  if (!adminSecret || provided !== adminSecret) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const result: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform:  process.platform,
  };

  // ── Vérification de la clé ───────────────────────────────────────────────────
  const rawKey = process.env.STRIPE_SECRET_KEY ?? "";
  result["keyPresent"] = rawKey.length > 0;
  result["keyLength"]  = rawKey.length;
  result["keyTrimmed"] = rawKey !== rawKey.trim();
  result["stripeMode"] =
    rawKey.trim().startsWith("sk_live_") ? "live" :
    rawKey.trim().startsWith("sk_test_") ? "test"  :
    "unknown";

  // ── Test de connectivité Stripe ──────────────────────────────────────────────
  const t0 = Date.now();
  try {
    const stripe  = getStripeClient();
    const balance = await stripe.balance.retrieve();
    result["stripeConnectivity"] = "ok";
    result["stripeDurationMs"]   = Date.now() - t0;
    result["stripeCurrency"]     = balance.available?.[0]?.currency ?? "n/a";
    result["stripeAvailable"]    =
      (balance.available ?? []).map((b) => `${b.amount} ${b.currency}`).join(", ") || "0";
  } catch (err) {
    result["stripeConnectivity"] = "error";
    result["stripeDurationMs"]   = Date.now() - t0;

    if (err && typeof err === "object") {
      const e = err as {
        type?: string; code?: string; statusCode?: number;
        requestId?: string; message?: string;
      };
      result["errorType"]       = e.type;
      result["errorCode"]       = e.code;
      result["errorStatusCode"] = e.statusCode;
      result["errorRequestId"]  = e.requestId;
      result["errorMessage"]    = e.message;
    } else {
      result["errorMessage"] = String(err);
    }
  }

  // ── Test création session Checkout ──────────────────────────────────────────
  const t1 = Date.now();
  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: "test@tibaduizaeli.com",
      line_items: [
        {
          price_data: {
            currency:    "eur",
            unit_amount: 100,
            product_data: { name: "Test diagnostic" },
          },
          quantity: 1,
        },
      ],
      success_url: "https://tibaduizaeli.com/boutique/commande/succes?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:  "https://tibaduizaeli.com/boutique/commande/annulation",
    });
    result["checkoutSession"] = "ok";
    result["checkoutDurationMs"] = Date.now() - t1;
    result["checkoutSessionId"]  = session.id;

    // Expire immédiatement la session test pour ne pas la laisser ouverte
    await stripe.checkout.sessions.expire(session.id);
    result["sessionExpired"] = true;
  } catch (err) {
    result["checkoutSession"]    = "error";
    result["checkoutDurationMs"] = Date.now() - t1;

    if (err && typeof err === "object") {
      const e = err as {
        type?: string; code?: string; statusCode?: number;
        requestId?: string; message?: string;
      };
      result["checkoutErrorType"]       = e.type;
      result["checkoutErrorCode"]       = e.code;
      result["checkoutErrorStatusCode"] = e.statusCode;
      result["checkoutErrorMessage"]    = e.message;
    } else {
      result["checkoutErrorMessage"] = String(err);
    }
  }

  return NextResponse.json(result, { status: 200 });
}
