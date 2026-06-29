export default function AProposPage() {
  return (
    <div style={{ padding: "clamp(24px, 5vw, 40px) clamp(16px, 5vw, 24px) 60px", maxWidth: "640px" }}>
      <h1
        style={{
          fontSize: "13px",
          fontWeight: 300,
          marginBottom: "32px",
          color: "var(--text)",
        }}
      >
        À propos de moi
      </h1>

      <div
        style={{
          fontSize: "13px",
          fontWeight: 300,
          lineHeight: "1.9",
          color: "var(--text)",
        }}
      >
        <p style={{ marginBottom: "20px" }}>
          Ma pratique photographique est comme une boîte à souvenirs qui place
          le portrait au cœur du témoignage, qu&apos;il s&apos;exprime en noir
          et blanc ou en couleur.
        </p>

        <p style={{ marginBottom: "20px" }}>
          Si ces deux approches m&apos;apportent des temporalités différentes :
          celle de l&apos;illusion du passé argentique par laquelle j&apos;ai
          commencé à m&apos;exercer, face à la réalité brute du numérique dans
          laquelle je m&apos;aventure depuis peu.
        </p>

        <p style={{ marginBottom: "20px" }}>
          L&apos;enjeu demeure le même&nbsp;: celui de ne pas seulement capturer
          un visage mais une histoire, une trace sociale, intime, et les
          transporter dans mon monde à la fois.
        </p>

        <p style={{ marginBottom: "20px" }}>
          C&apos;est la rencontre avec l&apos;autre qui me renvoie à moi-même,
          qui me confronte à mon propre regard.
        </p>

        <p style={{ marginBottom: "0" }}>
          Mon intention n&apos;est pas d&apos;expliquer le sujet ou de parler à
          sa place mais de le saisir dans son altérité. J&apos;aime naviguer
          entre le visible et le caché, sans trop manipuler l&apos;image,
          pour laisser le réel respirer entre mes intentions et vos
          interprétations.
        </p>
      </div>

      <div
        style={{
          marginTop: "40px",
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
