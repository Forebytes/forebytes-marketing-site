import { ImageResponse } from "next/og";

export const alt = "Forebytes: See it before you bite it.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f5ead8", padding: 72, color: "#201e1d" }}>
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700, color: "#8c491a" }}>Forebytes</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, fontWeight: 800, lineHeight: 1, letterSpacing: -4 }}>
          <span>See it before</span>
          <span style={{ color: "#c67139" }}>you bite it.</span>
        </div>
        <div style={{ display: "flex", fontSize: 32 }}>Restaurant discovery and AR menus. Launching in Dublin.</div>
      </div>
    ),
    size,
  );
}
