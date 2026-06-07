import { ImageResponse } from "next/og";
import { SEO } from "@/lib/seo";

export const alt = "checktarga.it — Storico veicolo e verifica targa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #ecfdf5 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 24,
              background: "#0f172a",
            }}
          >
            <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
              <path
                d="M24.5 12.5C22.4 10.8 19.8 10 17 10C11.75 10 7.5 14.25 7.5 19.5C7.5 24.75 11.75 29 17 29C19.8 29 22.4 28.2 24.5 26.5"
                stroke="#ffffff"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <path
                d="M27.5 14.5L30.5 17.5L35.5 12"
                stroke="#059669"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "baseline", fontSize: 52, color: "#0f172a" }}>
              <span style={{ fontWeight: 300, letterSpacing: "0.03em" }}>check</span>
              <span style={{ fontWeight: 700, letterSpacing: "-0.03em" }}>targa</span>
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  color: "#059669",
                }}
              >
                .IT
              </span>
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "#64748b", marginTop: 8 }}>
              Verifica storico veicolo in Italia
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1.2,
            }}
          >
            {SEO.description}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {["Chilometri", "Sinistri", "Revisioni", "Dati PRA"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "12px 20px",
                  borderRadius: 999,
                  background: "white",
                  color: "#059669",
                  fontSize: 22,
                  fontWeight: 600,
                  border: "2px solid #d1fae5",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
