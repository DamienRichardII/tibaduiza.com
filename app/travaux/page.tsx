import Link from "next/link";
import { travaux } from "@/data/travaux";

export default function TravauxPage() {
  return (
    <div style={{ padding: "40px 24px 60px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2px",
        }}
      >
        {travaux.map((cat) => (
          <Link
            key={cat.id}
            href={`/travaux/${cat.id}`}
            style={{ position: "relative", display: "block", aspectRatio: "3/4", overflow: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cat.coverSrc}
              alt={cat.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.4s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(248,247,245,0)",
                transition: "background-color 0.3s",
              }}
              className="cat-overlay"
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 300,
                  letterSpacing: "0.08em",
                  color: "var(--text)",
                  opacity: 0,
                  transition: "opacity 0.3s",
                  textTransform: "uppercase",
                }}
                className="cat-label"
              >
                {cat.title}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        a:hover .cat-overlay {
          background-color: rgba(248,247,245,0.5);
        }
        a:hover .cat-label {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
