"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, use } from "react";
import { boutique } from "@/data/boutique";
import { useCart } from "@/components/CartContext";

const cat = boutique.find((c) => c.id === "tirages")!;

export default function TirageProduitPage({
  params,
}: {
  params: Promise<{ produit: string }>;
}) {
  const { produit: produitId } = use(params);
  const p = cat.produits.find((x) => x.id === produitId);
  if (!p) notFound();

  const [selectedFormat, setSelectedFormat] = useState(
    p.formats?.[0]?.label ?? ""
  );
  const [added, setAdded] = useState(false);
  const [openLivraison, setOpenLivraison] = useState(false);
  const [openRetours, setOpenRetours] = useState(false);
  const { addItem } = useCart();

  const selectedPrice =
    p.formats?.find((f) => f.label === selectedFormat)?.price ?? p.price;

  const handleAdd = () => {
    addItem({
      id: p.id + selectedFormat,
      title: p.title,
      price: selectedPrice,
      format: selectedFormat,
      src: p.src,
    });
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
        <Link href="/boutique/tirages" style={{ color: "var(--text)" }}>
          Tirages
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
          <p style={{ fontSize: "11px", color: "var(--details)" }}>
            {selectedPrice}
          </p>
        </div>

        {/* Sidebar */}
        <div>
          {p.formats && (
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 300,
                  marginBottom: "12px",
                  color: "var(--text)",
                }}
              >
                Formats
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {p.formats.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setSelectedFormat(f.label)}
                    style={{
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 300,
                      padding: "6px 0",
                      background: "none",
                      border: "none",
                      borderBottom:
                        selectedFormat === f.label
                          ? "1px solid var(--text)"
                          : "1px solid transparent",
                      cursor: "pointer",
                      color:
                        selectedFormat === f.label
                          ? "var(--text)"
                          : "var(--details)",
                    }}
                  >
                    {f.label} — {f.price}
                  </button>
                ))}
              </div>
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

          {/* Accordion: Livraison */}
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
                  fontWeight: 300,
                  color: "var(--details)",
                  paddingBottom: "14px",
                  lineHeight: "1.6",
                }}
              >
                Livraison en France sous 5 à 10 jours ouvrés. Les tirages sont
                expédiés roulés dans un tube de protection ou à plat dans une
                enveloppe rigide selon le format.
              </p>
            )}
          </div>

          {/* Accordion: Retours */}
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
                  fontWeight: 300,
                  color: "var(--details)",
                  paddingBottom: "14px",
                  lineHeight: "1.6",
                }}
              >
                Les tirages étant produits à la commande, ils ne sont pas
                remboursables sauf en cas de défaut constaté à la réception.
                Contactez tibaduizaelipro@gmail.com dans les 48h suivant la
                livraison.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
