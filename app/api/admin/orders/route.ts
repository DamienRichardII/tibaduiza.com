import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { OrderStatus } from "@/lib/database.types";

// ── Type guard — valide qu'une string URL est un statut de commande connu ──
const ORDER_STATUSES: readonly OrderStatus[] = [
  "pending",
  "paid",
  "preparing",
  "shipped",
  "completed",
  "canceled",
  "refunded",
] as const;

function isOrderStatus(value: string | null): value is OrderStatus {
  return !!value && (ORDER_STATUSES as readonly string[]).includes(value);
}

function isAuthorized(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("x-admin-secret") === secret;
}

/** GET /api/admin/orders?status=paid&page=1 */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");
  const page        = parseInt(searchParams.get("page") ?? "1", 10);
  const limit       = 20;
  const offset      = (page - 1) * limit;

  // Valider le statut avant de l'envoyer à Supabase
  if (statusParam !== null && !isOrderStatus(statusParam)) {
    return NextResponse.json(
      { error: `Statut invalide : "${statusParam}". Valeurs acceptées : ${ORDER_STATUSES.join(", ")}.` },
      { status: 400 }
    );
  }

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // statusParam est maintenant garanti OrderStatus | null
  if (isOrderStatus(statusParam)) {
    query = query.eq("order_status", statusParam);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Erreur BDD." }, { status: 500 });

  return NextResponse.json({ orders: data, total: count, page, limit });
}
