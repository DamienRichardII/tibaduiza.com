import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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
  const status = searchParams.get("status");
  const page   = parseInt(searchParams.get("page") ?? "1", 10);
  const limit  = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("order_status", status);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Erreur BDD." }, { status: 500 });

  return NextResponse.json({ orders: data, total: count, page, limit });
}
