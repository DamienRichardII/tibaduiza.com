export default function AProposPage() {
  return (
    <div style={{ padding: "40px 24px 60px", maxWidth: "720px" }}>
      <h1
        style={{
          fontSize: "13px",
          fontWeight: 300,
          marginBottom: "40px",
          color: "var(--text)",
        }}
      >
        A propos
      </h1>

      <p
        style={{
          fontSize: "13px",
          fontWeight: 300,
          lineHeight: "1.8",
          color: "var(--text)",
          marginBottom: "40px",
        }}
      >
        Elisabeth Tibaduiza Manosalva est une photographe française d&apos;origine
        colombienne basée à Paris. Son travail explore les liens entre corps,
        territoire et mémoire — à travers des séries documentaires et des
        projets artistiques qui mêlent portrait, paysage et narration intime.
        Formée aux arts visuels, elle développe depuis plusieurs années une
        pratique photographique sensible et engagée, nourrie de ses deux
        cultures. Son projet Tierra de Gigantes, réalisé en Colombie, témoigne
        de ce dialogue entre l&apos;humain et la montagne, entre l&apos;intime et le
        grandiose.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <a
          href="https://www.instagram.com/canardgentil"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "13px",
            fontWeight: 300,
            color: "var(--text)",
          }}
        >
          @canardgentil
        </a>
        <a
          href="mailto:tibaduizaelipro@gmail.com"
          style={{
            fontSize: "13px",
            fontWeight: 300,
            color: "var(--text)",
          }}
        >
          tibaduizaelipro@gmail.com
        </a>
      </div>
    </div>
  );
}
