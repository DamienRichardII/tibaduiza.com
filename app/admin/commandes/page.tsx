"use client";

import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Order = {
  id:                         string;
  order_number:               string;
  created_at:                 string;
  customer_first_name:        string;
  customer_last_name:         string;
  customer_email:             string;
  customer_phone:             string | null;
  delivery_mode:              "domicile" | "main-propre";
  shipping_first_name:        string;
  shipping_last_name:         string;
  shipping_address_line1:     string | null;
  shipping_address_line2:     string | null;
  shipping_postal_code:       string | null;
  shipping_city:              string | null;
  shipping_country:           string | null;
  product_name:               string;
  product_price:              number;
  quantity:                   number;
  total_amount:               number;
  currency:                   string;
  payment_status:             string;
  order_status:               string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id:   string | null;
  stripe_receipt_url:         string | null;
  carrier_name:               string | null;
  tracking_number:            string | null;
  tracking_url:               string | null;
  shipped_at:                 string | null;
};

type StatusFilter =
  | "all"
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "completed"
  | "canceled"
  | "refunded";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
    hour:  "2-digit",
    minute:"2-digit",
  });
}

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    pending:    "En attente",
    paid:       "Payée",
    preparing:  "En préparation",
    shipped:    "Expédiée",
    completed:  "Terminée",
    canceled:   "Annulée",
    refunded:   "Remboursée",
  };
  return map[s] ?? s;
}

function statusColor(s: string): string {
  const map: Record<string, string> = {
    pending:   "#b07800",
    paid:      "#1a7a1a",
    preparing: "#1a5c9e",
    shipped:   "#1a5c9e",
    completed: "#0b0b0b",
    canceled:  "#720101",
    refunded:  "#555",
  };
  return map[s] ?? "#555";
}

function fullAddress(order: Order): string {
  if (order.delivery_mode === "main-propre") return "Remise en main propre (Île-de-France)";
  return [
    order.shipping_address_line1,
    order.shipping_address_line2,
    `${order.shipping_postal_code ?? ""} ${order.shipping_city ?? ""}`.trim(),
    order.shipping_country,
  ].filter(Boolean).join(", ");
}

function ordersToCSV(orders: Order[]): string {
  const headers = [
    "Numéro", "Date", "Prénom", "Nom", "Email", "Téléphone",
    "Livraison", "Adresse", "Produit", "Montant", "Paiement", "Statut",
    "Session Stripe", "PaymentIntent",
  ];
  const rows = orders.map((o) => [
    o.order_number,
    new Date(o.created_at).toLocaleDateString("fr-FR"),
    o.customer_first_name,
    o.customer_last_name,
    o.customer_email,
    o.customer_phone ?? "",
    o.delivery_mode === "main-propre" ? "Main propre" : "Domicile",
    fullAddress(o),
    o.product_name,
    formatPrice(o.total_amount),
    o.payment_status,
    o.order_status,
    o.stripe_checkout_session_id ?? "",
    o.stripe_payment_intent_id ?? "",
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`));
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminCommandesPage() {
  // Auth
  const [username, setUsername] = useState("");
  const [secret,   setSecret]   = useState("");
  const [authed,   setAuthed]   = useState(false);
  const [authErr,  setAuthErr]  = useState("");

  // Orders
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [filter,   setFilter]   = useState<StatusFilter>("all");
  const [loading,  setLoading]  = useState(false);
  const [apiErr,   setApiErr]   = useState("");

  // Detail
  const [selected, setSelected] = useState<Order | null>(null);

  // Ship form
  const [shipCarrier,  setShipCarrier]  = useState("");
  const [shipTracking, setShipTracking] = useState("");
  const [shipUrl,      setShipUrl]      = useState("");
  const [shipping,     setShipping]     = useState(false);
  const [shipMsg,      setShipMsg]      = useState("");

  // Copy
  const [copied, setCopied] = useState("");

  const LIMIT = 20;

  // ── Charge les commandes ─────────────────────────────────────────────────
  const loadOrders = useCallback(async (s: string, p: number, f: StatusFilter) => {
    setLoading(true);
    setApiErr("");
    const params = new URLSearchParams({ page: String(p) });
    if (f !== "all") params.set("status", f);
    try {
      const res = await fetch(`/api/admin/orders?${params}`, {
        headers: { "x-admin-secret": s },
      });
      if (res.status === 401) { setAuthed(false); return; }
      const json = await res.json();
      if (!res.ok) { setApiErr(json.error ?? "Erreur"); return; }
      setOrders(json.orders ?? []);
      setTotal(json.total ?? 0);
    } catch {
      setApiErr("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) loadOrders(secret, page, filter);
  }, [authed, page, filter, loadOrders, secret]);

  // ── Login ────────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthErr("");
    // Vérification identifiant côté client (non secret, juste un filtre UX)
    if (username.trim().toLowerCase() !== "tibaduizaeli") {
      setAuthErr("Identifiant incorrect.");
      return;
    }
    // Vérification mot de passe côté API (compare avec ADMIN_SECRET sur le serveur)
    const res = await fetch("/api/admin/orders?page=1", {
      headers: { "x-admin-secret": secret },
    });
    if (res.status === 401) {
      setAuthErr("Mot de passe incorrect.");
      return;
    }
    setAuthed(true);
  }

  // ── Expédition ───────────────────────────────────────────────────────────
  async function handleShip(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setShipping(true);
    setShipMsg("");
    try {
      const res = await fetch(`/api/admin/orders/${selected.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({
          order_status:    "shipped",
          carrier_name:    shipCarrier  || undefined,
          tracking_number: shipTracking || undefined,
          tracking_url:    shipUrl      || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setShipMsg("Erreur : " + (json.error ?? "?")); return; }
      setShipMsg("✓ Commande marquée expédiée — email client envoyé.");
      setSelected(json.order);
      loadOrders(secret, page, filter);
    } catch {
      setShipMsg("Erreur réseau.");
    } finally {
      setShipping(false);
    }
  }

  // ── Export CSV ────────────────────────────────────────────────────────────
  function exportCSV() {
    const csv  = ordersToCSV(orders);
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `commandes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Copier adresse ────────────────────────────────────────────────────────
  function copyAddress(order: Order) {
    const addr = fullAddress(order);
    navigator.clipboard.writeText(addr).then(() => {
      setCopied(order.id);
      setTimeout(() => setCopied(""), 2000);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Rendu — Login
  // ─────────────────────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <form onSubmit={handleLogin} style={{ width: "320px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#272525", marginBottom: "24px" }}>
            Elisabeth Tibaduiza Manosalva — Admin
          </p>
          <p style={{ fontSize: "13px", fontWeight: 300, marginBottom: "16px" }}>Espace commandes</p>

          <input
            type="text"
            placeholder="Identifiant"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            style={{
              width: "100%", padding: "10px 12px", fontSize: "13px", fontWeight: 300,
              border: "1px solid rgba(0,0,0,0.2)", outline: "none",
              backgroundColor: "#fff", marginBottom: "12px", boxSizing: "border-box",
            }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              width: "100%", padding: "10px 12px", fontSize: "13px", fontWeight: 300,
              border: "1px solid rgba(0,0,0,0.2)", outline: "none",
              backgroundColor: "#fff", marginBottom: "12px", boxSizing: "border-box",
            }}
          />

          {authErr && (
            <p style={{ fontSize: "12px", color: "#720101", marginBottom: "12px" }}>{authErr}</p>
          )}

          <button
            type="submit"
            style={{
              width: "100%", padding: "12px", backgroundColor: "#0b0b0b", color: "#fff",
              fontSize: "12px", fontWeight: 300, letterSpacing: "0.08em", border: "none",
              cursor: "pointer", textTransform: "uppercase",
            }}
          >
            Accéder
          </button>
        </form>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Rendu — Interface admin
  // ─────────────────────────────────────────────────────────────────────────

  const totalPages = Math.ceil(total / LIMIT);
  const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
    { value: "all",       label: "Toutes" },
    { value: "pending",   label: "En attente" },
    { value: "paid",      label: "Payées" },
    { value: "preparing", label: "En préparation" },
    { value: "shipped",   label: "Expédiées" },
    { value: "completed", label: "Terminées" },
    { value: "canceled",  label: "Annulées" },
    { value: "refunded",  label: "Remboursées" },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px 80px" }}>

      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#272525", margin: "0 0 4px" }}>
            Elisabeth Tibaduiza Manosalva
          </p>
          <h1 style={{ fontSize: "16px", fontWeight: 300, margin: 0 }}>
            Commandes <span style={{ color: "#555", fontSize: "13px" }}>({total})</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={exportCSV}
            style={{ padding: "8px 16px", fontSize: "11px", fontWeight: 300, letterSpacing: "0.06em", border: "1px solid rgba(0,0,0,0.2)", backgroundColor: "#fff", cursor: "pointer", textTransform: "uppercase" }}
          >
            Export CSV
          </button>
          <button
            onClick={() => { setAuthed(false); setSecret(""); }}
            style={{ padding: "8px 16px", fontSize: "11px", fontWeight: 300, letterSpacing: "0.06em", border: "1px solid rgba(0,0,0,0.2)", backgroundColor: "#fff", cursor: "pointer", textTransform: "uppercase" }}
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Filtres statut */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setPage(1); }}
            style={{
              padding: "6px 14px", fontSize: "11px", fontWeight: 300,
              letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
              border: "1px solid rgba(0,0,0,0.2)",
              backgroundColor: filter === f.value ? "#0b0b0b" : "#fff",
              color: filter === f.value ? "#fff" : "#0b0b0b",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Erreur API */}
      {apiErr && <p style={{ color: "#720101", fontSize: "12px", marginBottom: "16px" }}>{apiErr}</p>}

      {/* Loading */}
      {loading && <p style={{ fontSize: "12px", color: "#555", marginBottom: "16px" }}>Chargement...</p>}

      {/* Tableau commandes */}
      {!loading && orders.length === 0 && (
        <p style={{ fontSize: "13px", fontWeight: 300, color: "#555" }}>Aucune commande.</p>
      )}

      {orders.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontWeight: 300 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.15)" }}>
                {["Numéro", "Date", "Client", "Email", "Livraison", "Montant", "Paiement", "Statut", ""].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", fontWeight: 400 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", backgroundColor: selected?.id === order.id ? "rgba(0,0,0,0.03)" : "transparent" }}
                >
                  <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: "11px" }}>{order.order_number}</td>
                  <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    {order.customer_first_name} {order.customer_last_name}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <a href={`mailto:${order.customer_email}`} style={{ color: "#0b0b0b" }}>{order.customer_email}</a>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    {order.delivery_mode === "main-propre" ? "Main propre" : "Domicile"}
                  </td>
                  <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                    {formatPrice(order.total_amount)}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 400, color: statusColor(order.payment_status), textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 400, color: statusColor(order.order_status), textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {statusLabel(order.order_status)}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <button
                      onClick={() => { setSelected(order); setShipCarrier(""); setShipTracking(""); setShipUrl(""); setShipMsg(""); }}
                      style={{ fontSize: "11px", fontWeight: 300, border: "1px solid rgba(0,0,0,0.2)", backgroundColor: "#fff", padding: "4px 10px", cursor: "pointer" }}
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: "8px", marginTop: "24px", alignItems: "center" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ padding: "6px 14px", fontSize: "11px", border: "1px solid rgba(0,0,0,0.2)", backgroundColor: "#fff", cursor: page === 1 ? "not-allowed" : "pointer" }}
          >
            ←
          </button>
          <span style={{ fontSize: "12px", color: "#555" }}>Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ padding: "6px 14px", fontSize: "11px", border: "1px solid rgba(0,0,0,0.2)", backgroundColor: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer" }}
          >
            →
          </button>
        </div>
      )}

      {/* ── Panneau détail commande ─────────────────────────────────────────── */}
      {selected && (
        <div
          style={{
            position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 100, display: "flex", justifyContent: "flex-end",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div
            style={{
              width: "min(560px, 100vw)", height: "100vh", overflowY: "auto",
              backgroundColor: "#f5f5f3", padding: "32px 28px",
              boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
            }}
          >
            {/* Close */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", margin: 0 }}>
                {selected.order_number}
              </p>
              <button
                onClick={() => setSelected(null)}
                style={{ fontSize: "18px", background: "none", border: "none", cursor: "pointer", color: "#0b0b0b", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {/* Statuts */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
              <span style={{ fontSize: "10px", fontWeight: 400, color: statusColor(selected.payment_status), border: `1px solid ${statusColor(selected.payment_status)}`, padding: "2px 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {selected.payment_status}
              </span>
              <span style={{ fontSize: "10px", fontWeight: 400, color: statusColor(selected.order_status), border: `1px solid ${statusColor(selected.order_status)}`, padding: "2px 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {statusLabel(selected.order_status)}
              </span>
            </div>

            {/* Section Client */}
            <Section title="Client">
              <Row label="Nom" value={`${selected.customer_first_name} ${selected.customer_last_name}`} />
              <Row label="Email" value={<a href={`mailto:${selected.customer_email}`} style={{ color: "#0b0b0b" }}>{selected.customer_email}</a>} />
              <Row label="Téléphone" value={selected.customer_phone ?? "—"} />
              <Row label="Date" value={formatDate(selected.created_at)} />
            </Section>

            <Divider />

            {/* Section Livraison */}
            <Section title="Livraison">
              <Row
                label="Mode"
                value={selected.delivery_mode === "main-propre"
                  ? "Remise en main propre (Île-de-France)"
                  : "Livraison à domicile"}
              />
              {selected.delivery_mode === "domicile" && (
                <>
                  <Row label="Adresse" value={[
                    selected.shipping_address_line1,
                    selected.shipping_address_line2,
                  ].filter(Boolean).join(", ") || "—"} />
                  <Row label="Code postal / Ville" value={`${selected.shipping_postal_code ?? ""} ${selected.shipping_city ?? ""}`.trim() || "—"} />
                  <Row label="Pays" value={selected.shipping_country ?? "—"} />
                  <button
                    onClick={() => copyAddress(selected)}
                    style={{ marginTop: "8px", fontSize: "11px", fontWeight: 300, border: "1px solid rgba(0,0,0,0.2)", backgroundColor: "#fff", padding: "6px 14px", cursor: "pointer" }}
                  >
                    {copied === selected.id ? "✓ Copié !" : "Copier l'adresse"}
                  </button>
                </>
              )}
              {selected.shipped_at && (
                <Row label="Expédiée le" value={formatDate(selected.shipped_at)} />
              )}
              {selected.carrier_name && (
                <Row label="Transporteur" value={selected.carrier_name} />
              )}
              {selected.tracking_number && (
                <Row
                  label="Suivi"
                  value={selected.tracking_url
                    ? <a href={selected.tracking_url} target="_blank" rel="noreferrer" style={{ color: "#0b0b0b" }}>{selected.tracking_number}</a>
                    : selected.tracking_number}
                />
              )}
            </Section>

            <Divider />

            {/* Section Produit */}
            <Section title="Produit">
              <Row label="Produit" value={selected.product_name} />
              <Row label="Quantité" value={String(selected.quantity)} />
              <Row label="Montant" value={`${formatPrice(selected.total_amount)} ${selected.currency.toUpperCase()}`} />
            </Section>

            <Divider />

            {/* Section Stripe */}
            <Section title="Stripe">
              <Row label="Session" value={<span style={{ fontFamily: "monospace", fontSize: "11px", wordBreak: "break-all" }}>{selected.stripe_checkout_session_id ?? "—"}</span>} />
              <Row label="PaymentIntent" value={<span style={{ fontFamily: "monospace", fontSize: "11px", wordBreak: "break-all" }}>{selected.stripe_payment_intent_id ?? "—"}</span>} />
              {selected.stripe_receipt_url && (
                <Row label="Reçu" value={<a href={selected.stripe_receipt_url} target="_blank" rel="noreferrer" style={{ color: "#0b0b0b" }}>Voir le reçu</a>} />
              )}
            </Section>

            <Divider />

            {/* Section Expédition */}
            {selected.order_status !== "shipped" && selected.order_status !== "completed" && (
              <Section title="Marquer comme expédiée">
                <form onSubmit={handleShip} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Field label="Transporteur (optionnel)" value={shipCarrier} onChange={setShipCarrier} placeholder="Colissimo, Mondial Relay..." />
                  <Field label="Numéro de suivi (optionnel)" value={shipTracking} onChange={setShipTracking} placeholder="1Z999AA10123456784" />
                  <Field label="Lien de suivi (optionnel)" value={shipUrl} onChange={setShipUrl} placeholder="https://..." />

                  <button
                    type="submit"
                    disabled={shipping}
                    style={{
                      padding: "10px", backgroundColor: shipping ? "#555" : "#0b0b0b", color: "#fff",
                      fontSize: "12px", fontWeight: 300, letterSpacing: "0.08em", border: "none",
                      cursor: shipping ? "not-allowed" : "pointer", textTransform: "uppercase",
                    }}
                  >
                    {shipping ? "Envoi..." : "Confirmer l'expédition"}
                  </button>

                  {shipMsg && (
                    <p style={{ fontSize: "12px", color: shipMsg.startsWith("✓") ? "#1a7a1a" : "#720101" }}>
                      {shipMsg}
                    </p>
                  )}
                </form>
              </Section>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sous-composants
// ─────────────────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <p style={{ fontSize: "10px", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", margin: "0 0 12px" }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px", marginBottom: "8px", fontSize: "12px", fontWeight: 300 }}>
      <span style={{ color: "#555" }}>{label}</span>
      <span style={{ color: "#0b0b0b", wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", margin: "20px 0" }} />;
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: "11px", fontWeight: 300, color: "#555", display: "block", marginBottom: "4px" }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "8px 10px", fontSize: "12px", fontWeight: 300,
          border: "1px solid rgba(0,0,0,0.2)", outline: "none",
          backgroundColor: "#fff", boxSizing: "border-box",
        }}
      />
    </div>
  );
}
