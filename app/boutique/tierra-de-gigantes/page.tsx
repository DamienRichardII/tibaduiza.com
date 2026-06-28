"use client";

import Link from "next/link";
import { useState } from "react";
import { boutique } from "@/data/boutique";

const cat = boutique.find((c) => c.id === "tierra-de-gigantes")!;
const livre = cat.produits[0];

type DeliveryMode = "domicile" | "main-propre";

export default function TierraDeGigantesPage() {
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("domicile");
  const [openLivraison, setOpenLivraison] = useState(false);
  const [openRetours, setOpenRetours] = useState(false);

  return (
    <div style={{ padding: "clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px) 60px" }}>
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
        <Link href="/boutique" style={{ color: "var(--text)" }}>
          Boutique
        </Link>
        <span style={{ color: "var(--details)" }}>&gt;</span>
        <span style={{ color: "var(--accent)" }}>Tierra de Gigantes</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: "clamp(24px, 6vw, 60px)",
          alignItems: "start",
        }}
      >
        {/* Photo du livre */}
        <div style={{ textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={livre.src}
            alt={livre.title}
            style={{
              maxWidth: "460px",
              width: "100%",
              aspectRatio: "1/1",
              objectFit: "cover",
              margin: "0 auto",
            }}
          />
          <p
            style={{
              marginTop: "14px",
              fontSize: "13px",
              fontWeight: 300,
              color: "var(--text)",
            }}
          >
            {livre.title}
          </p>
          <p style={{ fontSize: "12px", color: "var(--details)", marginTop: "4px" }}>
            {livre.price}
          </p>
        </div>

        {/* Colonne droite */}
        <div>
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
              marginBottom: "20px",
            }}
          >
            Précommande ouverte
          </div>

          {/* Message délai */}
          <p
            style={{
              fontSize: "12px",
              fontWeight: 300,
              color: "var(--details)",
              lineHeight: "1.7",
              marginBottom: "24px",
            }}
          >
            Les expéditions débuteront sous un mois, le temps de finaliser les précommandes et de lancer la production.
          </p>

          {/* Description */}
          {livre.description && (
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 300,
                  color: "var(--details)",
                  marginBottom: "4px",
                }}
              >
                {livre.dimensions}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 300,
                  color: "var(--text)",
                  lineHeight: "1.7",
                }}
              >
                {livre.description}
              </p>
            </div>
          )}

          {/* ── Mode de livraison ── */}
          <div style={{ marginBottom: "20px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 300,
                color: "var(--details)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              Mode de livraison
            </p>

            {/* Option domicile */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                cursor: "pointer",
                marginBottom: "10px",
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
                  L&apos;adresse de livraison vous sera demandée à la commande.
                </span>
              </span>
            </label>

            {/* Option main propre */}
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
                  Réservée aux habitants d&apos;Île-de-France.
                </span>
              </span>
            </label>

            {/* Message remise en main propre */}
            {deliveryMode === "main-propre" && (
              <div
                style={{
                  marginTop: "12px",
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
          </div>

          {/* CTA Précommander */}
          <Link
            href={`/boutique/tierra-de-gigantes/commander?mode=${deliveryMode}`}
            style={{
              display: "block",
              width: "100%",
              padding: "14px",
              backgroundColor: "var(--text)",
              color: "var(--bg)",
              fontSize: "12px",
              fontWeight: 300,
              letterSpacing: "0.1em",
              textAlign: "center",
              textTransform: "uppercase",
              textDecoration: "none",
              marginBottom: "24px",
              transition: "background-color 0.2s",
            }}
          >
            Je précommande mon exemplaire
          </Link>

          {/* Accordéon livraison */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}>
            <button
              onClick={() => setOpenLivraison((v) => !v)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 300,
                color: "var(--text)",
              }}
            >
              Informations de livraison
              <span>{openLivraison ? "−" : "+"}</span>
            </button>
            {openLivraison && (
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--details)",
                  paddingBottom: "14px",
                  lineHeight: "1.6",
                }}
              >
                Livraison en France sous un mois environ. Le livre est
                expédié emballé soigneusement dans un carton rigide.
                Une remise en main propre est possible pour les habitants
                d&apos;Île-de-France — les modalités seront communiquées par email.
              </p>
            )}
          </div>

          {/* Accordéon retours */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}>
            <button
              onClick={() => setOpenRetours((v) => !v)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 300,
                color: "var(--text)",
              }}
            >
              Politique de retours
              <span>{openRetours ? "−" : "+"}</span>
            </button>
            {openRetours && (
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--details)",
                  paddingBottom: "14px",
                  lineHeight: "1.6",
                }}
              >
                Retours acceptés dans les 14 jours si le produit est en parfait
                état. Contactez tibaduizaelipro@gmail.com.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
