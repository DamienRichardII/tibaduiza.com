import Stripe from "stripe";

/**
 * Factory function — crée un client Stripe à la demande.
 * Le throw se produit dans le handler (runtime), jamais au build.
 */
export function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY manquant — vérifier les variables d'environnement."
    );
  }

  return new Stripe(key, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });
}

/** Prix du livre en centimes — défini côté serveur uniquement, jamais depuis le frontend */
export const LIVRE_PRICE_CENTS = 4500; // 45,00 €
export const LIVRE_CURRENCY = "eur";
export const LIVRE_NAME = "Tierra de gigantes — Livre photo";
