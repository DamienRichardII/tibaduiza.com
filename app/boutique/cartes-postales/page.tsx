import Link from "next/link";
import { boutique } from "@/data/boutique";

const cat = boutique.find((c) => c.id === "cartes-postales")!;

export default function CartesPostalesPage() {
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
        <span style={{ color: "var(--accent)" }}>Cartes postales</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {cat.produits.map((p) => (
          <Link
            key={p.id}
            href={`/boutique/cartes-postales/${p.id}`}
            style={{ display: "block" }}
          >
            <div
              style={{
                aspectRatio: "3/2",
                overflow: "hidden",
                marginBottom: "8px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s",
                }}
              />
            </div>
            <p style={{ fontSize: "12px", fontWeight: 300, color: "var(--text)" }}>
              {p.title}
            </p>
            <p style={{ fontSize: "11px", color: "var(--details)" }}>{p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
