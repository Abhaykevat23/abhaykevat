"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const SOURCES = [
  { label: "APIs", x: 50 },
  { label: "Databases", x: 150 },
  { label: "Files", x: 250 },
  { label: "Apps", x: 350 },
];

const STAGES = [
  { label: "INGESTION", note: "APIs · AWS" },
  { label: "CDC ENGINE", note: "AWS DMS" },
  { label: "SNOWFLAKE", note: "landing → staging" },
  { label: "dbt TRANSFORM", note: "models · tests" },
  { label: "DATA QUALITY", note: "validation gates" },
  { label: "ANALYTICS", note: "serving layer" },
  { label: "AI", note: "data agent" },
];

const CX = 200;
const NODE_W = 150;
const NODE_H = 34;
const FIRST_Y = 122;
const GAP = 62;
const stageY = (i: number) => FIRST_Y + i * GAP;
const END_Y = stageY(STAGES.length - 1) + NODE_H / 2;

/** Path a packet follows: out of a source, into the trunk, down through every stage. */
const packetPath = (x: number) =>
  `M ${x} 46 C ${x} 92, ${CX} 78, ${CX} ${FIRST_Y} L ${CX} ${END_Y}`;

/**
 * Hero visual: four generic sources converging into the canonical pipeline.
 * Stages boot up one by one on load, then packets flow through continuously.
 */
export function HeroPipeline() {
  const reduce = usePrefersReducedMotion();
  const [booted, setBooted] = useState(0);
  const lit = reduce ? STAGES.length : booted;

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setBooted((n) => {
        if (n >= STAGES.length) {
          window.clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 320);
    return () => window.clearInterval(id);
  }, [reduce]);

  const running = lit >= STAGES.length;

  return (
    <svg
      viewBox="0 0 400 560"
      className="h-auto w-full max-w-[440px]"
      role="img"
      aria-label="Data pipeline: APIs, databases, files and apps flow through ingestion, CDC, Snowflake, dbt transformation, data quality, analytics and AI."
    >
      <defs>
        {/* userSpaceOnUse: a vertical line has a zero-width bounding box, which disables bbox gradients */}
        <linearGradient id="trunk" gradientUnits="userSpaceOnUse" x1={CX} y1={FIRST_Y} x2={CX} y2={END_Y}>
          <stop offset="0" stopColor="var(--color-flow)" />
          <stop offset="0.8" stopColor="var(--color-flow)" />
          <stop offset="1" stopColor="var(--color-ai)" />
        </linearGradient>
      </defs>

      {/* Wires */}
      <g fill="none" strokeWidth="1">
        {SOURCES.map((s) => (
          <path
            key={s.label}
            d={`M ${s.x} 46 C ${s.x} 92, ${CX} 78, ${CX} ${FIRST_Y}`}
            stroke={lit > 0 ? "var(--color-flow)" : "var(--color-line)"}
            strokeOpacity={lit > 0 ? 0.45 : 1}
            style={{ transition: "stroke 0.4s" }}
          />
        ))}
        <line x1={CX} y1={FIRST_Y} x2={CX} y2={END_Y} stroke="var(--color-line)" />
        <line
          x1={CX}
          y1={FIRST_Y}
          x2={CX}
          y2={lit > 0 ? stageY(lit - 1) + NODE_H / 2 : FIRST_Y}
          stroke="url(#trunk)"
          strokeOpacity="0.7"
          style={{ transition: "all 0.3s linear" }}
        />
      </g>

      {/* Packets */}
      {running && !reduce && (
        <g>
          {SOURCES.flatMap((s, i) =>
            [0, 1].map((k) => (
              <circle key={`${s.label}-${k}`} r="2.6" fill="var(--color-ice)">
                <animateMotion
                  dur="6.4s"
                  begin={`${-(i * 0.8 + k * 3.2)}s`}
                  repeatCount="indefinite"
                  path={packetPath(s.x)}
                />
              </circle>
            )),
          )}
        </g>
      )}

      {/* Sources */}
      {SOURCES.map((s) => (
        <g key={s.label}>
          <rect
            x={s.x - 43}
            y={14}
            width={86}
            height={32}
            rx={8}
            fill="var(--color-raised)"
            stroke="var(--color-line)"
          />
          <text
            x={s.x}
            y={34}
            textAnchor="middle"
            fontSize="11"
            fontFamily="var(--font-mono)"
            fill="var(--color-mute)"
          >
            {s.label}
          </text>
        </g>
      ))}

      {/* Stages (drawn over the trunk so packets pass through them) */}
      {STAGES.map((stage, i) => {
        const on = i < lit;
        const isAi = i === STAGES.length - 1;
        const accent = isAi ? "var(--color-ai)" : "var(--color-flow)";
        const y = stageY(i) - NODE_H / 2;
        return (
          <g key={stage.label}>
            <text
              x={CX - NODE_W / 2 - 12}
              y={stageY(i) + 3.5}
              textAnchor="end"
              fontSize="9.5"
              fontFamily="var(--font-mono)"
              fill={on ? accent : "var(--color-dim)"}
              style={{ transition: "fill 0.4s" }}
            >
              {String(i + 1).padStart(2, "0")}
            </text>
            <rect
              x={CX - NODE_W / 2}
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx={9}
              fill="var(--color-raised)"
              stroke={on ? accent : "var(--color-line)"}
              strokeOpacity={on ? 0.85 : 1}
              style={{ transition: "stroke 0.4s" }}
            />
            <text
              x={CX}
              y={stageY(i) + 4}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="500"
              letterSpacing="0.06em"
              fontFamily="var(--font-mono)"
              fill={on ? "var(--color-ink)" : "var(--color-dim)"}
              style={{ transition: "fill 0.4s" }}
            >
              {stage.label}
            </text>
            <text
              x={CX + NODE_W / 2 + 12}
              y={stageY(i) + 3.5}
              fontSize="9.5"
              fontFamily="var(--font-mono)"
              fill="var(--color-dim)"
              opacity={on ? 1 : 0}
              style={{ transition: "opacity 0.4s" }}
            >
              {stage.note}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
