import { notFound } from "next/navigation";
import Link from "next/link";
import { travaux } from "@/data/travaux";

export function generateStaticParams() {
  return travaux.flatMap((c) =>
    c.series.flatMap((s) =>
      s.photos.map((p) => ({
        categorie: c.id,
        serie: s.id,
        photoId: p.id,
      }))
    )
  );
}

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ categorie: string; serie: string; photoId: string }>;
}) {
  const { categorie, serie, photoId } = await params;
  const cat = travaux.find((c) => c.id === categorie);
  if (!cat) notFound();
  const serieData = cat.series.find((s) => s.id === serie);
  if (!serieData) notFound();
  const photoIndex = serieData.photos.findIndex((p) => p.id === photoId);
  if (photoIndex === -1) notFound();
  const photo = serieData.photos[photoIndex];
  const total = serieData.photos.length;
  const prev = photoIndex > 0 ? serieData.photos[photoIndex - 1] : null;
  const next =
    photoIndex < total - 1 ? serieData.photos[photoIndex + 1] : null;

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
        <Link href={`/travaux/${cat.id}`} style={{ color: "var(--text)" }}>
          {cat.title}
        </Link>
        <span style={{ color: "var(--details)" }}>&gt;</span>
        <Link
          href={`/travaux/${cat.id}/${serie}`}
          style={{ color: "var(--text)" }}
        >
          {serieData.title}
        </Link>
        <span style={{ color: "var(--details)" }}>&gt;</span>
        <span style={{ color: "var(--accent)" }}>{photo.title}</span>
      </div>

      {/* Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "48px",
          alignItems: "start",
        }}
      >
        {/* Photo */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.title}
            style={{
              width: "100%",
              objectFit: "cover",
              maxHeight: "75vh",
            }}
          />
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "12px", fontWeight: 300, color: "var(--text)" }}>
              {photo.title}
            </p>
            <p style={{ fontSize: "12px", color: "var(--details)" }}>
              {photoIndex + 1}/{total}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ paddingTop: "0" }}>
          {photo.description && (
            <p
              style={{
                fontSize: "13px",
                fontWeight: 300,
                lineHeight: "1.7",
                color: "var(--text)",
                marginBottom: "24px",
              }}
            >
              {photo.description}
            </p>
          )}
          {photo.lieu && (
            <p
              style={{
                fontSize: "12px",
                color: "var(--details)",
                marginBottom: "32px",
              }}
            >
              {photo.lieu}
            </p>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: "24px" }}>
            {prev ? (
              <Link
                href={`/travaux/${cat.id}/${serie}/${prev.id}`}
                style={{
                  fontSize: "12px",
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                ← Précédent
              </Link>
            ) : (
              <span style={{ fontSize: "12px", color: "var(--details)", opacity: 0.4 }}>
                ← Précédent
              </span>
            )}
            {next ? (
              <Link
                href={`/travaux/${cat.id}/${serie}/${next.id}`}
                style={{
                  fontSize: "12px",
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Suivant →
              </Link>
            ) : (
              <span style={{ fontSize: "12px", color: "var(--details)", opacity: 0.4 }}>
                Suivant →
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
