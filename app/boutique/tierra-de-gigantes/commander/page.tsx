"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type DeliveryMode = "domicile" | "main-propre";

function CommanderForm() {
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as DeliveryMode) ?? "domicile";

  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName:    "",
    lastName:     "",
    email:        "",
    phone:        "",
    addressLine1: "",
    addressLine2: "",
    postalCode:   "",
    city:         "",
    country:      "France",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/checkout/create-session", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName:    form.firstName,
          lastName:     form.lastName,
          email:        form.email,
          phone:        form.phone || undefined,
          deliveryMode,
          addressLine1: deliveryMode === "domicile" ? form.addressLine1 : undefined,
          addressLine2: deliveryMode === "domicile" ? form.addressLine2 || undefined : undefined,
          postalCode:   deliveryMode === "domicile" ? form.postalCode : undefined,
          city:         deliveryMode === "domicile" ? form.city : undefined,
          country:      deliveryMode === "domicile" ? form.country : undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.url) {
        setErrorMsg(json.error ?? "Une erreur est survenue. Veuillez réessayer.");
        setLoading(false);
        return;
      }

      // Redirection vers Stripe Checkout
      window.location.href = json.url;

    } catch {
      setErrorMsg("Erreur de connexion. Vérifiez votre connexion internet et réessayez.");
      setLoading(false);
    }
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
    appearance: "none" as const,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 300,
    color: "var(--details)",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    marginBottom: "6px",
  };

  return (
    <div
      style={{
        padding:    "clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px) 60px",
        maxWidth:   "560px",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          marginBottom: "clamp(20px, 4vw, 32px)",
          fontSize:     "12px",
          fontWeight:   300,
          display:      "flex",
          gap:          "8px",
          flexWrap:     "wrap",
        }}
      >
        <Link href="/boutique" style={{ color: "var(--text)" }}>Boutique</Link>
        <span style={{ color: "var(--details)" }}>&gt;</span>
        <Link href="/boutique/tierra-de-gigantes" style={{ color: "var(--text)" }}>
          Tierra de Gigantes
        </Link>
        <span style={{ color: "var(--details)" }}>&gt;</span>
        <span style={{ color: "var(--accent)" }}>Précommander</span>
      </div>

      {/* Titre + badge */}
      <h1
        style={{
          fontSize:  "13px",
          fontWeight: 300,
          marginBottom: "8px",
          color: "var(--text)",
        }}
      >
        Tierra de gigantes — 45€
      </h1>
      <div
        style={{
          display:         "inline-block",
          backgroundColor: "var(--accent)",
          color:           "#fff",
          fontSize:        "10px",
          fontWeight:      300,
          padding:         "3px 10px",
          letterSpacing:   "0.1em",
          textTransform:   "uppercase",
          marginBottom:    "28px",
        }}
      >
        Précommande ouverte
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        {/* Prénom / Nom */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
            gap: "12px",
          }}
        >
          <div>
            <label style={labelStyle}>Prénom *</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              autoComplete="given-name"
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
              autoComplete="family-name"
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
            autoComplete="email"
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
            autoComplete="tel"
            style={inputStyle}
          />
        </div>

        {/* Mode de livraison */}
        <div>
          <p
            style={{
              ...labelStyle,
              marginBottom: "10px",
            }}
          >
            Mode de livraison *
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="delivery"
                value="domicile"
                checked={deliveryMode === "domicile"}
                onChange={() => setDeliveryMode("domicile")}
                style={{ marginTop: "2px", accentColor: "var(--accent)" }}
              />
              <span>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 300,
                    color: "var(--text)",
                  }}
                >
                  Livraison à domicile
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "11px",
                    color: "var(--details)",
                    marginTop: "2px",
                  }}
                >
                  France et international — frais inclus
                </span>
              </span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="delivery"
                value="main-propre"
                checked={deliveryMode === "main-propre"}
                onChange={() => setDeliveryMode("main-propre")}
                style={{ marginTop: "2px", accentColor: "var(--accent)" }}
              />
              <span>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 300,
                    color: "var(--text)",
                  }}
                >
                  Remise en main propre
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "11px",
                    color: "var(--details)",
                    marginTop: "2px",
                  }}
                >
                  Île-de-France uniquement
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Message main propre */}
        {deliveryMode === "main-propre" && (
          <div
            style={{
              padding:         "12px 14px",
              backgroundColor: "rgba(114,1,1,0.05)",
              borderLeft:      "2px solid var(--accent)",
              fontSize:        "11px",
              fontWeight:      300,
              color:           "var(--details)",
              lineHeight:      "1.6",
            }}
          >
            Les modalités de remise vous seront communiquées par email après validation de votre précommande.
          </div>
        )}

        {/* Adresse — livraison domicile uniquement */}
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
                autoComplete="address-line1"
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
                autoComplete="address-line2"
                style={inputStyle}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label style={labelStyle}>Code postal *</label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  autoComplete="postal-code"
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
                  autoComplete="address-level2"
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
                autoComplete="country-name"
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option>France</option>
                <option>Belgique</option>
                <option>Suisse</option>
                <option>Luxembourg</option>
                <option>Canada</option>
                <option>Espagne</option>
                <option>Italie</option>
                <option>Allemagne</option>
                <option>Royaume-Uni</option>
                <option>États-Unis</option>
                <option>Colombie</option>
                <option>Autre</option>
              </select>
            </div>
          </>
        )}

        {/* Message d'erreur */}
        {errorMsg && (
          <div
            style={{
              padding:         "12px 14px",
              backgroundColor: "rgba(114,1,1,0.08)",
              borderLeft:      "2px solid var(--accent)",
              fontSize:        "12px",
              fontWeight:      300,
              color:           "var(--accent)",
              lineHeight:      "1.5",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Note sécurité */}
        <p
          style={{
            fontSize:   "11px",
            fontWeight: 300,
            color:      "var(--details)",
            lineHeight: "1.6",
          }}
        >
          Paiement sécurisé par Stripe. Vos données bancaires ne transitent jamais par notre serveur.
          Les expéditions débuteront sous un mois.
        </p>

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width:           "100%",
            padding:         "14px",
            backgroundColor: loading ? "var(--details)" : "var(--text)",
            color:           "var(--bg)",
            fontSize:        "12px",
            fontWeight:      300,
            letterSpacing:   "0.1em",
            border:          "none",
            cursor:          loading ? "not-allowed" : "pointer",
            transition:      "background-color 0.2s",
            textTransform:   "uppercase",
          }}
        >
          {loading ? "Redirection vers le paiement..." : "Procéder au paiement — 45€"}
        </button>
      </form>
    </div>
  );
}

export default function CommanderPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            padding:    "40px 24px",
            fontSize:   "13px",
            fontWeight: 300,
            color:      "var(--details)",
          }}
        >
          Chargement...
        </div>
      }
    >
      <CommanderForm />
    </Suspense>
  );
}
