"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, use } from "react";
import { boutique } from "@/data/boutique";
import { useCart } from "@/components/CartContext";

const cat = boutique.find((c) => c.id === "cartes-postales")!;

export default function CartePostaleProduitPage({
  params,
}: {
  params: Promise<{ produit: string }>;
}) {
  const { produit: produitId } = use(params);
  const p = cat.produits.find((x) => x.id === produitId);
  if (!p) notFound();

  const [added, setAdded] = useState(false);
  const [openLivraison, setOpenLivraison] = useState(false);
  const [openRetours, setOpenRetours] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ id: p.id, title: p.title, price: p.price, src: p.src });
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
        <Link href="/boutique/cartes-postales" style={{ color: "var(--text)" }}>
          Cartes postales
        </Link>
        <span style={{ color: "var(--details)" }}>&gt;</span>
        <span style={{ color: "var(--accent)" }}>{p.title}</span>
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
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.src}
            alt={p.title}
            style={{ width: "100%", objectFit: "cover" }}
          />
          <p
            style={{
              marginTop: "10px",
              fontSize: "12px",
              fontWeight: 300,
              color: "var(--text)",
            }}
          >
            {p.title}
          </p>
          <p style={{ fontSize: "11px", color: "var(--details)" }}>{p.price}</p>
        </div>

        {/* Sidebar */}
        <div>
          {p.description && (
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 300,
                  color: "var(--text)",
                  marginBottom: "6px",
                }}
              >
                Description
              </p>
              {p.dimensions && (
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 300,
                    color: "var(--details)",
                    marginBottom: "8px",
                  }}
                >
                  Dimensions
                </p>
              )}
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 300,
                  color: "var(--text)",
                  lineHeight: "1.6",
                }}
              >
                {p.description}
              </p>
              {p.dimensions && (
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "11px",
                    color: "var(--details)",
                  }}
                >
                  {p.dimensions}
                </p>
              )}
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
                Livraison en France sous 5 à 10 jours ouvrés. Expédition
                sécurisée en enveloppe rigide.
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
                Produits non remboursables sauf défaut. Contactez
                tibaduizaelipro@gmail.com dans les 48h.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
