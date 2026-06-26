import { notFound } from "next/navigation";
import Link from "next/link";
import { travaux } from "@/data/travaux";

export function generateStaticParams() {
  return travaux.flatMap((c) =>
    c.series.map((s) => ({ categorie: c.id, serie: s.id }))
  );
}

export default async function SeriePage({
  params,
}: {
  params: Promise<{ categorie: string; serie: string }>;
}) {
  const { categorie, serie } = await params;
  const cat = travaux.find((c) => c.id === categorie);
  if (!cat) notFound();
  const serieData = cat.series.find((s) => s.id === serie);
  if (!serieData) notFound();

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
          alignItems: "center",
        }}
      >
        <Link href="/travaux" style={{ color: "var(--text)" }}>
          Travaux
        </Link>
        <span style={{ color: "var(--details)" }}>&gt;</span>
        <Link
          href={`/travaux/${cat.id}`}
          style={{ color: "var(--text)" }}
        >
          {cat.title}
        </Link>
        <span style={{ color: "var(--details)" }}>&gt;</span>
        <span style={{ color: "var(--accent)" }}>{serieData.title}</span>
      </div>

      {/* Hero — first photo large */}
      <div style={{ marginBottom: "40px" }}>
        <Link href={`/travaux/${cat.id}/${serie}/${serieData.photos[0].id}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={serieData.photos[0].src}
            alt={serieData.title}
            style={{
              width: "100%",
              maxHeight: "60vh",
              objectFit: "cover",
            }}
          />
        </Link>
        <p
          style={{
            marginTop: "12px",
            fontSize: "12px",
            fontWeight: 300,
            color: "var(--text)",
          }}
        >
          {serieData.title}
        </p>
      </div>

      {/* Grid of remaining photos */}
      {serieData.photos.length > 1 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {serieData.photos.slice(1).map((photo) => (
            <Link
              key={photo.id}
              href={`/travaux/${cat.id}/${serie}/${photo.id}`}
              style={{ display: "block" }}
            >
              <div style={{ aspectRatio: "3/2", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s",
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
