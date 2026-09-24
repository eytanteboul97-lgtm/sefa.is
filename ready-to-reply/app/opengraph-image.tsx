import { ImageResponse } from "next/og";

export const alt = "Ready to Reply — Les bons marchés. Les bonnes réponses.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Image de partage générée au build, aux couleurs de la plaquette.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#BC542F",
          color: "#FFFCF7",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, fontFamily: "sans-serif", fontWeight: 700 }}>
          READY <span style={{ color: "#2B1E18", margin: "0 12px" }}>TO</span> REPLY
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 86, lineHeight: 1.08 }}>
          <span>Les bons marchés.</span>
          <span>Les bonnes réponses.</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, fontFamily: "sans-serif" }}>
          Du premier repérage au dossier prêt à déposer.
        </div>
      </div>
    ),
    size,
  );
}
