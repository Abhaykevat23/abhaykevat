"use client";

import { useState } from "react";
import { DemoTag, Reveal, Section } from "@/components/ui/Section";
import { cx } from "@/lib/cx";
import { usePrefersReducedMotion, useTicker } from "@/lib/hooks";

type Status = "queued" | "running" | "retry" | "success";

type Task = {
  id: string;
  stage: string;
  /** Centre of the node in the DAG's coordinate space */
  x: number;
  y: number;
  deps: string[];
  /** Ticks at which the task starts and finishes */
  start: number;
  end: number;
  /** Tick at which the first attempt fails and is retried */
  retryAt?: number;
  retryNote?: string;
  result: string;
};

const STAGES = [
  { name: "Extract", x: 80 },
  { name: "Load", x: 250 },
  { name: "Stage", x: 410 },
  { name: "Test", x: 570 },
  { name: "Model", x: 730 },
  { name: "Publish", x: 890 },
];

// A scripted run: parallel extracts, one retry, incremental models, tests gating the marts.
const TASKS: Task[] = [
  { id: "extract_api", stage: "Extract", x: 80, y: 70, deps: [], start: 1, end: 6, retryAt: 3, retryNote: "HTTP 429 rate limit · retry 1/3 with backoff", result: "48,210 rows" },
  { id: "extract_cdc", stage: "Extract", x: 80, y: 150, deps: [], start: 1, end: 4, result: "1,932 change events" },
  { id: "extract_files", stage: "Extract", x: 80, y: 230, deps: [], start: 1, end: 3, result: "12 files" },
  { id: "load_raw", stage: "Load", x: 250, y: 150, deps: ["extract_api", "extract_cdc", "extract_files"], start: 6, end: 8, result: "copy into raw · 50,154 rows" },
  { id: "stg_orders", stage: "Stage", x: 410, y: 110, deps: ["load_raw"], start: 8, end: 10, result: "incremental · 3,870 new rows" },
  { id: "stg_customers", stage: "Stage", x: 410, y: 190, deps: ["load_raw"], start: 8, end: 9, result: "incremental · 212 new rows" },
  { id: "dq_tests", stage: "Test", x: 570, y: 150, deps: ["stg_orders", "stg_customers"], start: 10, end: 12, result: "24/24 tests passed" },
  { id: "fct_orders", stage: "Model", x: 730, y: 110, deps: ["dq_tests"], start: 12, end: 14, result: "merge · 3,870 rows" },
  { id: "dim_customers", stage: "Model", x: 730, y: 190, deps: ["dq_tests"], start: 12, end: 13, result: "merge · 212 rows" },
  { id: "publish", stage: "Publish", x: 890, y: 150, deps: ["fct_orders", "dim_customers"], start: 14, end: 15, result: "marts refreshed · freshness target met" },
];

const BY_ID = Object.fromEntries(TASKS.map((t) => [t.id, t]));
const END = 15;
const CYCLE = END + 6; // rest on the finished run before replaying
const NODE_W = 128;
const NODE_H = 34;

function statusAt(task: Task, tick: number): Status {
  if (tick < task.start) return "queued";
  if (task.retryAt === tick) return "retry";
  if (tick < task.end) return "running";
  return "success";
}

type LogEvent = { tick: number; text: string; tone: "ok" | "warn" | "dim" };

const EVENTS: LogEvent[] = [
  { tick: 0, text: "scheduled run started", tone: "dim" as const },
  ...TASKS.flatMap((t) => [
    ...(t.retryAt !== undefined ? [{ tick: t.retryAt, text: `${t.id}  ${t.retryNote}`, tone: "warn" as const }] : []),
    { tick: t.end, text: `${t.id}  ${t.result}`, tone: "ok" as const },
  ]),
  { tick: END, text: "run succeeded · 10/10 tasks", tone: "ok" as const },
].sort((a, b) => a.tick - b.tick);

const clock = (tick: number) => {
  const seconds = tick * 14;
  return `02:${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

const STATUS_COLOR: Record<Status, string> = {
  queued: "var(--color-dim)",
  running: "var(--color-flow)",
  retry: "var(--color-warn)",
  success: "var(--color-ok)",
};

const STATUS_TEXT: Record<Status, string> = {
  queued: "text-dim",
  running: "text-flow",
  retry: "text-warn",
  success: "text-ok",
};

export function PipelineRun() {
  return (
    <Section
      id="demo"
      eyebrow="Pipeline run"
      title="What a production pipeline run actually looks like."
      lead="Ten tasks with real dependencies: parallel extracts, a retry on a rate-limited API, incremental models, and tests that gate what gets published."
    >
      {(live) => <Run live={live} />}
    </Section>
  );
}

function Run({ live }: { live: boolean }) {
  const reduce = usePrefersReducedMotion();
  const [raw, setRaw] = useState(0);
  useTicker(() => setRaw((t) => (t + 1) % CYCLE), 800, live && !reduce);
  const tick = reduce ? END : Math.min(raw, END);

  const statuses = Object.fromEntries(TASKS.map((t) => [t.id, statusAt(t, tick)])) as Record<string, Status>;
  const done = TASKS.filter((t) => statuses[t.id] === "success").length;
  const finished = tick >= END;
  const retries = tick >= 3 ? 1 : 0;
  const log = EVENTS.filter((e) => e.tick <= tick).slice(-7);

  return (
    <Reveal>
      <div className="panel overflow-hidden">
        {/* Run header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3 font-mono text-xs">
            <span
              className={cx(
                "flex-none rounded px-2 py-0.5 text-[10px] font-medium tracking-wider",
                finished ? "bg-ok/15 text-ok" : "bg-flow/15 text-flow",
              )}
            >
              {finished ? "SUCCESS" : "RUNNING"}
            </span>
            <span className="truncate text-ink">daily_warehouse_refresh</span>
            <span className="hidden text-dim sm:inline">schedule 02:00 UTC</span>
          </div>
          <DemoTag>Simulated run</DemoTag>
        </div>

        {/* DAG (desktop) */}
        <div className="hidden px-3 pt-2 lg:block">
          <svg
            viewBox="0 0 960 270"
            className="h-auto w-full"
            role="img"
            aria-label="Pipeline graph: three parallel extract tasks feed a load task, then two staging models, data quality tests, two mart models, and a publish step."
          >
            {STAGES.map((s) => (
              <text
                key={s.name}
                x={s.x}
                y={26}
                textAnchor="middle"
                fontSize="10"
                letterSpacing="0.14em"
                fontFamily="var(--font-mono)"
                fill="var(--color-dim)"
              >
                {s.name.toUpperCase()}
              </text>
            ))}

            {/* Dependencies */}
            {TASKS.flatMap((t) =>
              t.deps.map((depId) => {
                const dep = BY_ID[depId];
                const x1 = dep.x + NODE_W / 2;
                const x2 = t.x - NODE_W / 2;
                const mid = (x1 + x2) / 2;
                const d = `M ${x1} ${dep.y} C ${mid} ${dep.y}, ${mid} ${t.y}, ${x2} ${t.y}`;
                const fed = statuses[depId] === "success";
                const flowing = fed && statuses[t.id] === "running";
                return (
                  <g key={`${depId}-${t.id}`}>
                    <path
                      d={d}
                      fill="none"
                      stroke={fed ? "var(--color-flow)" : "var(--color-line)"}
                      strokeOpacity={fed ? 0.6 : 1}
                      style={{ transition: "stroke 0.4s" }}
                    />
                    {flowing && !reduce && (
                      <circle r="2.6" fill="var(--color-ice)">
                        <animateMotion dur="0.8s" repeatCount="indefinite" path={d} />
                      </circle>
                    )}
                  </g>
                );
              }),
            )}

            {/* Tasks */}
            {TASKS.map((t) => {
              const status = statuses[t.id];
              const color = STATUS_COLOR[status];
              return (
                <g key={t.id}>
                  <rect
                    x={t.x - NODE_W / 2}
                    y={t.y - NODE_H / 2}
                    width={NODE_W}
                    height={NODE_H}
                    rx={8}
                    fill="var(--color-raised)"
                    stroke={status === "queued" ? "var(--color-line)" : color}
                    strokeOpacity={status === "queued" ? 1 : 0.8}
                    style={{ transition: "stroke 0.3s" }}
                  />
                  <circle
                    cx={t.x - NODE_W / 2 + 13}
                    cy={t.y}
                    r={3.2}
                    fill={color}
                    className={status === "running" ? "pulse-dot" : undefined}
                  />
                  <text
                    x={t.x - NODE_W / 2 + 24}
                    y={t.y + 3.8}
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                    fill={status === "queued" ? "var(--color-mute)" : "var(--color-ink)"}
                  >
                    {t.id}
                  </text>
                  {status === "retry" && (
                    <text
                      x={t.x}
                      y={t.y - NODE_H / 2 - 6}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontFamily="var(--font-mono)"
                      fill="var(--color-warn)"
                    >
                      retry 1/3
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Task list (phones and tablets, where the graph would be unreadable) */}
        <ol className="divide-y divide-line/60 lg:hidden" aria-label="Pipeline tasks">
          {TASKS.map((t) => {
            const status = statuses[t.id];
            return (
              <li key={t.id} className="flex items-center gap-3 px-4 py-2 font-mono text-xs">
                <span className={cx("w-3 flex-none text-center", STATUS_TEXT[status], status === "running" && "pulse-dot")}>
                  {status === "success" ? "✓" : status === "queued" ? "○" : status === "retry" ? "↻" : "●"}
                </span>
                <span className={status === "queued" ? "text-mute" : "text-ink"}>{t.id}</span>
                <span className={cx("ml-auto truncate text-[11px]", status === "success" ? "text-dim" : STATUS_TEXT[status])}>
                  {status === "success" ? t.result : status === "retry" ? "retry 1/3" : status}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Log + summary */}
        <div className="grid border-t border-line lg:grid-cols-[1fr_auto]">
          <ol
            className="h-[10.5rem] overflow-hidden px-4 py-3 font-mono text-[11px] leading-[1.35rem] sm:px-5"
            aria-label="Run log"
          >
            {log.map((e) => (
              <li key={`${e.tick}-${e.text}`} className="row-in flex gap-3">
                <span className="flex-none text-dim">{clock(e.tick)}</span>
                <span
                  className={cx(
                    "truncate whitespace-pre",
                    e.tone === "warn" ? "text-warn" : e.tone === "ok" ? "text-mute" : "text-dim",
                  )}
                >
                  {e.tone === "ok" && <span className="text-ok">✓ </span>}
                  {e.tone === "warn" && "↻ "}
                  {e.text}
                </span>
              </li>
            ))}
          </ol>

          <dl className="grid grid-cols-4 gap-px border-t border-line bg-line lg:w-[22rem] lg:grid-cols-2 lg:border-t-0 lg:border-l">
            <Metric term="Tasks" value={`${done}/${TASKS.length}`} />
            <Metric term="Retries" value={String(retries)} tone={retries ? "text-warn" : undefined} />
            <Metric term="Tests" value={statuses.dq_tests === "success" ? "24/24" : "—"} tone="text-ok" />
            <Metric term="Duration" value={clock(tick).slice(3)} />
          </dl>
        </div>
      </div>

      <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm text-mute sm:grid-cols-3">
        {[
          ["Idempotent by design", "A retried or re-run task never double-loads data."],
          ["Incremental, not full", "Models process what changed since the last run."],
          ["Tests gate the publish", "Marts only refresh after data quality checks pass."],
        ].map(([title, body]) => (
          <li key={title} className="border-l border-flow/40 pl-3">
            <span className="block text-ink">{title}</span>
            {body}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function Metric({ term, value, tone }: { term: string; value: string; tone?: string }) {
  return (
    <div className="bg-panel px-3 py-3 sm:px-4">
      <dt className="text-[10px] tracking-wider text-dim uppercase">{term}</dt>
      <dd className={cx("mt-1 font-mono text-sm tabular-nums", tone ?? "text-ink")}>{value}</dd>
    </div>
  );
}
