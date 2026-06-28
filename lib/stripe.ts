import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY manquant — vérifier les variables d'environnement.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

/** Prix du livre en centimes — défini côté serveur uniquement, jamais depuis le frontend */
export const LIVRE_PRICE_CENTS = 4500; // 45,00 €
export const LIVRE_CURRENCY = "eur";
export const LIVRE_NAME = "Tierra de gigantes — Livre photo";
