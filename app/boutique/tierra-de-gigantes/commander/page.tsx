"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type DeliveryMode = "domicile" | "main-propre";

function CommanderForm() {
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as DeliveryMode) ?? "domicile";

  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(initialMode);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    city: "",
    country: "France",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // TODO Phase backend : remplacer par un POST /api/checkout/create-session
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation en attendant le backend Stripe
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    fontSize: "13px",
    fontWeight: 300,
    color: "var(--text)",
    backgroundColor: "transparent",
    border: "1px solid rgba(0,0,0,0.2)",
    outline: "none",
    fontFamily: "inherit",
    appearance: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 300,
    color: "var(--details)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: "6px",
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: "480px", padding: "clamp(24px, 5vw, 48px) clamp(16px, 5vw, 24px)" }}>
        <div
          style={{
            backgroundColor: "rgba(114,1,1,0.05)",
            borderLeft: "2px solid var(--accent)",
            padding: "20px 24px",
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 300,
              color: "var(--text)",
              lineHeight: "1.7",
              marginBottom: "8px",
            }}
          >
            Votre précommande a bien été enregistrée.
          </p>
          <p style={{ fontSize: "12px", fontWeight: 300, color: "var(--details)", lineHeight: "1.6" }}>
            Vous recevrez un email de confirmation à <strong>{form.email}</strong> dès que le système de paiement sera actif.
            Les expéditions débuteront sous un mois.
          </p>
        </div>
        <Link
          href="/boutique"
          style={{
            fontSize: "12px",
            fontWeight: 300,
            color: "var(--text)",
            letterSpacing: "0.04em",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          ← Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px) 60px", maxWidth: "560px" }}>
      {/* Breadcrumb */}
      <div
        style={{
          marginBottom: "clamp(20px, 4vw, 32px)",
          fontSize: "12px",
          fontWeight: 300,
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <Link href="/boutique" style={{ color: "var(--text)" }}>Boutique</Link>
        <span style={{ color: "var(--details)" }}>&gt;</span>
        <Link href="/boutique/tierra-de-gigantes" style={{ color: "var(--text)" }}>Tierra de Gigantes</Link>
        <span style={{ color: "var(--details)" }}>&gt;</span>
        <span style={{ color: "var(--accent)" }}>Précommander</span>
      </div>

      <h1
        style={{
          fontSize: "13px",
          fontWeight: 300,
          marginBottom: "8px",
          color: "var(--text)",
          letterSpacing: "0.02em",
        }}
      >
        Tierra de gigantes — 45€
      </h1>

      {/* Badge précommande */}
      <div
        style={{
          display: "inline-block",
          backgroundColor: "var(--accent)",
          color: "#fff",
          fontSize: "10px",
          fontWeight: 300,
          padding: "3px 10px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "28px",
        }}
      >
        Précommande ouverte
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Nom / Prénom */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={labelStyle}>Prénom *</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Nom *</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Téléphone */}
        <div>
          <label style={labelStyle}>Téléphone</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Mode de livraison */}
        <div>
          <p style={{ ...labelStyle, marginBottom: "10px" }}>Mode de livraison *</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
              <input
                type="radio"
                name="delivery"
                value="domicile"
                checked={deliveryMode === "domicile"}
                onChange={() => setDeliveryMode("domicile")}
                style={{ marginTop: "2px", accentColor: "var(--accent)" }}
              />
              <span>
                <span style={{ display: "block", fontSize: "12px", fontWeight: 300, color: "var(--text)" }}>
                  Livraison à domicile
                </span>
              </span>
            </label>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
              <input
                type="radio"
                name="delivery"
                value="main-propre"
                checked={deliveryMode === "main-propre"}
                onChange={() => setDeliveryMode("main-propre")}
                style={{ marginTop: "2px", accentColor: "var(--accent)" }}
              />
              <span>
                <span style={{ display: "block", fontSize: "12px", fontWeight: 300, color: "var(--text)" }}>
                  Remise en main propre
                </span>
                <span style={{ display: "block", fontSize: "11px", color: "var(--details)", marginTop: "2px" }}>
                  Île-de-France uniquement
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Message remise en main propre */}
        {deliveryMode === "main-propre" && (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "rgba(114,1,1,0.05)",
              borderLeft: "2px solid var(--accent)",
              fontSize: "11px",
              fontWeight: 300,
              color: "var(--details)",
              lineHeight: "1.6",
            }}
          >
            Les modalités de remise vous seront communiquées par email après validation de votre précommande.
          </div>
        )}

        {/* Adresse — uniquement si domicile */}
        {deliveryMode === "domicile" && (
          <>
            <div>
              <label style={labelStyle}>Adresse *</label>
              <input
                name="addressLine1"
                value={form.addressLine1}
                onChange={handleChange}
                required
                placeholder="Numéro et rue"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Complément d&apos;adresse</label>
              <input
                name="addressLine2"
                value={form.addressLine2}
                onChange={handleChange}
                placeholder="Appartement, bâtiment, étage..."
                style={inputStyle}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Code postal *</label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Ville *</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Pays *</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                style={inputStyle}
              >
                <option>France</option>
                <option>Belgique</option>
                <option>Suisse</option>
                <option>Luxembourg</option>
                <option>Canada</option>
                <option>Autre</option>
              </select>
            </div>
          </>
        )}

        {/* Note précommande */}
        <p
          style={{
            fontSize: "11px",
            fontWeight: 300,
            color: "var(--details)",
            lineHeight: "1.6",
            paddingTop: "4px",
          }}
        >
          Vous serez redirigé vers le paiement sécurisé Stripe dès que le système sera actif.
          Les expéditions débuteront sous un mois.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: loading ? "var(--details)" : "var(--text)",
            color: "var(--bg)",
            fontSize: "12px",
            fontWeight: 300,
            letterSpacing: "0.1em",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
            textTransform: "uppercase",
          }}
        >
          {loading ? "Enregistrement..." : "Confirmer ma précommande"}
        </button>
      </form>
    </div>
  );
}

export default function CommanderPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px 24px", fontSize: "13px", fontWeight: 300, color: "var(--details)" }}>Chargement...</div>}>
      <CommanderForm />
    </Suspense>
  );
}
