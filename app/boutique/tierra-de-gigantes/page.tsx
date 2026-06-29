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
        {/* ── Colonne gauche — photo ── */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={livre.src}
            alt={livre.title}
            style={{
              maxWidth: "460px",
              width: "100%",
              aspectRatio: "1/1",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* ── Colonne droite — fiche produit ── */}
        <div>

          {/* 1. Titre */}
          <h1
            style={{
              fontSize: "14px",
              fontWeight: 300,
              color: "var(--text)",
              marginBottom: "6px",
              letterSpacing: "0.01em",
            }}
          >
            {livre.title}
          </h1>

          {/* 2. Badge précommande */}
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
              marginBottom: "14px",
            }}
          >
            Précommande ouverte
          </div>

          {/* 3. Prix */}
          <p
            style={{
              fontSize: "13px",
              fontWeight: 300,
              color: "var(--text)",
              marginBottom: "20px",
            }}
          >
            {livre.price}
          </p>

          {/* 4. Caractéristiques */}
          <p
            style={{
              fontSize: "11px",
              fontWeight: 300,
              color: "var(--details)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            Format
          </p>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 300,
              color: "var(--text)",
              marginBottom: "28px",
            }}
          >
            {livre.dimensions}
          </p>

          {/* 5. Description littéraire */}
          <div
            style={{
              fontSize: "13px",
              fontWeight: 300,
              lineHeight: "1.9",
              color: "var(--text)",
              marginBottom: "28px",
            }}
          >
            <p style={{ marginBottom: "16px" }}>
              Parler de la Colombie, c&apos;est parler de réalisme magique, c&apos;est le lieu
              de ceux qui cherchent l&apos;extraordinaire dans l&apos;ordinaire,
              le sacré dans le banal.
            </p>
            <p style={{ marginBottom: "16px" }}>
              Pourtant, ce n&apos;est pas ce que je cherche à montrer — mon travail
              photographique ne peut pas prétendre contenir ce qui ne peut que se vivre.
            </p>
            <p style={{ marginBottom: "16px" }}>
              Mais ce dont je suis certaine, c&apos;est que la Colombie se défend
              par elle-même. Chaque Colombien est un géant.
            </p>
            <p style={{ marginBottom: "16px" }}>
              Ce livre est le début d&apos;une réponse à la main tendue de ces mêmes
              géants qui m&apos;ont accompagnée, ceux qui m&apos;accompagnent aujourd&apos;hui
              et ceux qui m&apos;accompagneront demain.
            </p>
            <p>
              Le titre &laquo;&nbsp;Terre de Géants&nbsp;&raquo; vient de la traduction du mot muisca
              &laquo;&nbsp;Nimaima&nbsp;&raquo;, qui est le nom du village le plus présent dans ce livre.
            </p>
          </div>

          {/* 6. Message délai */}
          <p
            style={{
              fontSize: "12px",
              fontWeight: 300,
              color: "var(--details)",
              lineHeight: "1.7",
              marginBottom: "24px",
            }}
          >
            Les expéditions débuteront sous un mois, le temps de finaliser
            les précommandes et de lancer la production.
          </p>

          {/* 7. Mode de livraison */}
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
                Les modalités de remise vous seront communiquées par email
                après validation de votre précommande.
              </div>
            )}
          </div>

          {/* 8. CTA */}
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
                Livraison en France et à l&apos;international, frais inclus.
                Le livre est expédié soigneusement emballé dans un carton rigide.
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
