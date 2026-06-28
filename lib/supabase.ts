import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Variables Supabase manquantes — vérifier SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.");
}

/**
 * Client Supabase avec la service role key.
 * À utiliser UNIQUEMENT côté serveur (API Routes).
 * Ne jamais exposer SUPABASE_SERVICE_ROLE_KEY au frontend.
 */
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

/** Génère un numéro de commande lisible : TDG-YYYYMMDD-XXXX */
export function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TDG-${date}-${rand}`;
}
