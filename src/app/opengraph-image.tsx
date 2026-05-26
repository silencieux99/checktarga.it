import { ImageResponse } from "next/og";
import { SITE } from "@/lib/pricing";
import { SEO } from "@/lib/seo";

export const alt = `${SITE.name} — Storico veicolo e verifica targa`;
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
          background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 45%, #dbeafe 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 24,
              background: "#2563eb",
              color: "white",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            CT
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "#0f172a" }}>
              {SITE.name}
              <span style={{ color: "#2563eb" }}>.it</span>
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "#475569", marginTop: 8 }}>
              Verifica storico veicolo in Italia
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 900,
          }}
        >
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
            <div
              style={{
                display: "flex",
                padding: "12px 20px",
                borderRadius: 999,
                background: "white",
                color: "#1d4ed8",
                fontSize: 22,
                fontWeight: 600,
                border: "2px solid #bfdbfe",
              }}
            >
              Chilometri
            </div>
            <div
              style={{
                display: "flex",
                padding: "12px 20px",
                borderRadius: 999,
                background: "white",
                color: "#1d4ed8",
                fontSize: 22,
                fontWeight: 600,
                border: "2px solid #bfdbfe",
              }}
            >
              Sinistri
            </div>
            <div
              style={{
                display: "flex",
                padding: "12px 20px",
                borderRadius: 999,
                background: "white",
                color: "#1d4ed8",
                fontSize: 22,
                fontWeight: 600,
                border: "2px solid #bfdbfe",
              }}
            >
              Revisioni
            </div>
            <div
              style={{
                display: "flex",
                padding: "12px 20px",
                borderRadius: 999,
                background: "white",
                color: "#1d4ed8",
                fontSize: 22,
                fontWeight: 600,
                border: "2px solid #bfdbfe",
              }}
            >
              Dati PRA
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
