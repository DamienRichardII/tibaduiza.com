"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1600&q=85",
    href: "/travaux/noir-et-blanc",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85",
    href: "/travaux/tierra-de-gigantes",
  },
  {
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600&q=85",
    href: "/travaux/couleurs",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85",
    href: "/boutique",
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 56px)",
        overflow: "hidden",
        backgroundColor: "var(--bg)",
      }}
    >
      {slides.map((slide, i) => (
        <Link
          key={i}
          href={slide.href}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
            display: "block",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.src}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Link>
      ))}

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          zIndex: 10,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              border: "none",
              backgroundColor:
                i === current ? "var(--text)" : "rgba(0,0,0,0.3)",
              cursor: "pointer",
              padding: 0,
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>

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
            color: "var(--text)",
            letterSpacing: "0.05em",
          }}
        >
          @canardgentil
        </a>
      </div>
    </div>
  );
}
