import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/data/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoData = await readFile(join(process.cwd(), "public/brand/pixolve-logo.png"), "base64");
const logoSrc = `data:image/png;base64,${logoData}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 78% 18%, rgba(241,90,35,0.35), transparent 45%), linear-gradient(160deg, #242422 0%, #0b0b0a 70%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo admite <img> */}
        <img src={logoSrc} width={600} height={220} alt="" />
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 34,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {siteConfig.tagline}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 40 }}>
          {["Diseño Gráfico", "UI/UX", "Redes Sociales", "Páginas Web", "Hosting"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                background: "rgba(241,90,35,0.12)",
                color: "#ffb48a",
                fontSize: 22,
                border: "1px solid rgba(241,90,35,0.45)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
