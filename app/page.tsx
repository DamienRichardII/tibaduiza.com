"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 56px)",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/* Vidéo hero en boucle */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Instagram */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "24px",
          zIndex: 10,
        }}
      >
        <a
          href="https://www.instagram.com/canardgentil"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "12px",
            fontWeight: 300,
            color: "#fff",
            letterSpacing: "0.05em",
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          @canardgentil
        </a>
      </div>
    </div>
  );
}
