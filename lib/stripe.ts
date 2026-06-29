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
  const raw = process.env.STRIPE_SECRET_KEY;

  if (!raw) {
    throw new Error(
      "STRIPE_SECRET_KEY manquant — vérifier les variables d'environnement."
    );
  }

  // Nettoyage défensif : trim + suppression de guillemets entourants
  // (fréquent quand la valeur est copiée avec les guillemets dans Railway/Vercel)
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) ||
      (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }

  const mode =
    key.startsWith("sk_live_") ? "live" :
    key.startsWith("sk_test_") ? "test"  :
    "unknown";

  // Log de diagnostic sécurisé — jamais la clé complète
  console.log("[stripe] Secret key check", {
    present:     true,
    prefix:      key.slice(0, 8),       // ex: "sk_test_" ou "sk_live_"
    mode,
    length:      key.length,
    firstChar:   key.charCodeAt(0),     // 34 = guillemet, 115 = 's' (sk_...)
    hadQuotes:   raw.trim() !== key,
  });

  if (mode === "unknown") {
    console.error(
      "[stripe] ERREUR — clé invalide. Préfixe attendu: sk_test_ ou sk_live_. " +
      "Vérifier STRIPE_SECRET_KEY dans Railway/Vercel (pas de guillemets, pas pk_, pas whsec_, pas rk_)."
    );
  }

  return new Stripe(key, {
    apiVersion:        "2025-02-24.acacia",
    maxNetworkRetries: 2,
    timeout:           30000,
    // Force le transport Node.js https au lieu du fetch natif (Node 18+).
    // Corrige StripeConnectionError "Request was retried 2 times" sur Railway/Vercel.
    httpClient:        Stripe.createNodeHttpClient(),
  });
}

/** Prix du livre en centimes — défini côté serveur uniquement, jamais depuis le frontend */
export const LIVRE_PRICE_CENTS = 4500; // 45,00 €
export const LIVRE_CURRENCY = "eur";
export const LIVRE_NAME = "Tierra de gigantes — Livre photo";
