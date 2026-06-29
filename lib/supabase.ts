import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Factory function — crée un client Supabase à la demande.
 * Le throw se produit dans le handler (runtime), jamais au build.
 * À utiliser UNIQUEMENT côté serveur (API Routes).
 * Ne jamais exposer SUPABASE_SERVICE_ROLE_KEY côté client.
 */
export function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Variables Supabase manquantes — vérifier SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Génère un numéro de commande lisible : TDG-YYYYMMDD-XXXX */
export function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TDG-${date}-${rand}`;
}
