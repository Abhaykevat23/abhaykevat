import { ImageResponse } from "next/og";
import { site } from "@/data/site";

// The preview card shown when the site is shared on LinkedIn, WhatsApp, Slack, X, etc.
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STAGES = ["Ingest", "CDC", "Snowflake", "dbt", "Quality", "Analytics", "AI"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#eaf0fa",
          backgroundColor: "#0b1120",
          backgroundImage:
            "radial-gradient(circle at 12% 0%, rgba(56,189,248,0.35), transparent 55%), radial-gradient(circle at 100% 70%, rgba(167,139,250,0.32), transparent 50%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#38bdf8", letterSpacing: 2 }}>~/abhay.kevat</div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            {site.name}
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 40, color: "#a3b1c9" }}>{site.role}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {STAGES.map((stage, i) => (
            <div key={stage} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <div style={{ display: "flex", width: 28, height: 2, backgroundColor: "#38bdf8", opacity: 0.6 }} />}
              <div
                style={{
                  display: "flex",
                  padding: "10px 18px",
                  fontSize: 24,
                  borderRadius: 12,
                  backgroundColor: "#18233b",
                  border: `2px solid ${i === STAGES.length - 1 ? "#a78bfa" : "#2a3855"}`,
                }}
              >
                {stage}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
