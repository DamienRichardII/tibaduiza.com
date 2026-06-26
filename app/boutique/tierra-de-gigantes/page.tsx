"use client";

import Link from "next/link";
import { useState } from "react";
import { boutique } from "@/data/boutique";
import { useCart } from "@/components/CartContext";

const cat = boutique.find((c) => c.id === "tierra-de-gigantes")!;
const livre = cat.produits[0];

export default function TierraDeGigantesPage() {
  const [added, setAdded] = useState(false);
  const [openLivraison, setOpenLivraison] = useState(false);
  const [openRetours, setOpenRetours] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ id: livre.id, title: livre.title, price: livre.price, src: livre.src });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ padding: "24px 24px 60px" }}>
      {/* Breadcrumb */}
      <div
        style={{
          marginBottom: "32px",
          fontSize: "12px",
          fontWeight: 300,
          display: "flex",
          gap: "8px",
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
          gridTemplateColumns: "1fr 320px",
          gap: "60px",
          alignItems: "start",
        }}
      >
        {/* Photo */}
        <div style={{ textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={livre.src}
            alt={livre.title}
            style={{
              maxWidth: "480px",
              width: "100%",
              objectFit: "cover",
              margin: "0 auto",
            }}
          />
          <p
            style={{
              marginTop: "16px",
              fontSize: "13px",
              fontWeight: 300,
              color: "var(--text)",
            }}
          >
            {livre.title}
          </p>
          <p style={{ fontSize: "12px", color: "var(--details)" }}>{livre.price}</p>
        </div>

        {/* Sidebar */}
        <div>
          {livre.description && (
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 300,
                  color: "var(--text)",
                  marginBottom: "8px",
                }}
              >
                Description
              </p>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 300,
                  color: "var(--details)",
                  marginBottom: "8px",
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

          <button
            onClick={handleAdd}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: added ? "var(--accent)" : "var(--text)",
              color: "var(--bg)",
              fontSize: "12px",
              fontWeight: 300,
              letterSpacing: "0.1em",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.3s",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            {added ? "Ajouté ✓" : "Ajouter au panier"}
          </button>

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
                Livraison en France sous 5 à 10 jours ouvrés. Le livre est
                expédié emballé soigneusement dans un carton rigide.
              </p>
            )}
          </div>

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
