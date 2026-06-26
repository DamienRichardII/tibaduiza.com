import Link from "next/link";
import { boutique } from "@/data/boutique";

const cat = boutique.find((c) => c.id === "tirages")!;

export default function TiragesPage() {
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
        <span style={{ color: "var(--accent)" }}>Tirages</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {cat.produits.map((p) => (
          <Link
            key={p.id}
            href={`/boutique/tirages/${p.id}`}
            style={{ display: "block" }}
          >
            <div style={{ aspectRatio: "3/4", overflow: "hidden", marginBottom: "8px" }}>
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
