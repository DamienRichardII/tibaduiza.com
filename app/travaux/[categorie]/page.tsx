import { notFound } from "next/navigation";
import Link from "next/link";
import { travaux } from "@/data/travaux";

export function generateStaticParams() {
  return travaux.map((c) => ({ categorie: c.id }));
}

export default async function CategoriePage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const cat = travaux.find((c) => c.id === categorie);
  if (!cat) notFound();

  return (
    <div style={{ padding: "40px 24px 60px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}
      >
        {cat.series.map((serie) => (
          <Link
            key={serie.id}
            href={`/travaux/${cat.id}/${serie.id}`}
            style={{ display: "block" }}
          >
            <div
              style={{
                aspectRatio: "4/3",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={serie.coverSrc}
                alt={serie.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                }}
              />
            </div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 300,
                color: "var(--text)",
                letterSpacing: "0.05em",
              }}
            >
              {serie.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
