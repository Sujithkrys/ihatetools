import { ImageResponse } from "next/og";
import { getBaseUrl } from "@/lib/site";

export const alt = "ihatetools — free online tools for PDFs, images, audio and text";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = `${getBaseUrl()}/logo-light.png`;

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
          backgroundColor: "#FBFAF8",
        }}
      >
        <img
          src={logoSrc}
          width={132}
          height={132}
          style={{ borderRadius: 26, marginBottom: 36 }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            color: "#111212",
            letterSpacing: "-0.02em",
          }}
        >
          ihatetools
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#6E6B66",
            marginTop: 20,
          }}
        >
          100+ free tools for PDFs, images, audio and text
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 44 }}>
          {["#E8336D", "#F5C242", "#5BC8E8", "#2FB584", "#9B8AE6"].map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                width: 18,
                height: 18,
                borderRadius: 9,
                background: c,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
