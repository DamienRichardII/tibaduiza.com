import Stripe from "stripe";

/**
 * Factory function — crée un client Stripe à la demande.
 * Le throw se produit dans le handler (runtime), jamais au build.
 *
 * Stripe SDK v17 utilise native fetch par défaut sur Node 18+.
 * createNodeHttpClient() force le transport https classique de Node.js,
 * ce qui corrige les StripeConnectionError sur Railway et Vercel.
 */
export function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY manquant — vérifier les variables d'environnement."
    );
  }

  const trimmedKey = key.trim();
  const mode =
    trimmedKey.startsWith("sk_live_") ? "live" :
    trimmedKey.startsWith("sk_test_") ? "test"  :
    "unknown";

  console.log(`[stripe] Init — mode: ${mode}, présence clé: oui`);

  return new Stripe(trimmedKey, {
    apiVersion:        "2025-02-24.acacia",
    maxNetworkRetries: 2,
    // Force le transport Node.js https au lieu du fetch natif (Node 18+).
    // Corrige StripeConnectionError "Request was retried 2 times" sur Railway/Vercel.
    httpClient:        Stripe.createNodeHttpClient(),
  });
}

/** Prix du livre en centimes — défini côté serveur uniquement, jamais depuis le frontend */
export const LIVRE_PRICE_CENTS = 4500; // 45,00 €
export const LIVRE_CURRENCY = "eur";
export const LIVRE_NAME = "Tierra de gigantes — Livre photo";
