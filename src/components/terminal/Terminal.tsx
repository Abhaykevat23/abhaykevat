"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal, Section } from "@/components/ui/Section";
import { projects, site } from "@/data/site";

type Tone = "ok" | "flow" | "ai" | "warn" | "dim";
type Line = { text: string; tone?: Tone };

const TONE: Record<Tone, string> = {
  ok: "text-ok",
  flow: "text-flow",
  ai: "text-ai",
  warn: "text-warn",
  dim: "text-dim",
};

const status = (name: string, state: string, tone: Tone = "ok"): Line => ({
  text: `✓ ${name} ${".".repeat(Math.max(3, 22 - name.length))} ${state}`,
  tone,
});

const COMMANDS: Record<string, Line[]> = {
  "pipeline status": [
    status("ingestion", "RUNNING"),
    status("transformation", "RUNNING"),
    status("data-quality", "PASSED"),
    status("warehouse", "HEALTHY"),
    status("analytics", "READY"),
    status("ai-agent", "ONLINE", "ai"),
  ],
  "show architecture": [
    { text: "[sources]    apis · databases · files" },
    { text: "    ↓", tone: "flow" },
    { text: "[ingest]     apis · aws dms · cdc" },
    { text: "    ↓", tone: "flow" },
    { text: "[warehouse]  snowflake: landing → staging → analytics" },
    { text: "    ↓", tone: "flow" },
    { text: "[transform]  dbt models + tests" },
    { text: "    ↓", tone: "flow" },
    { text: "[quality]    schema · nulls · duplicates · freshness" },
    { text: "    ↓", tone: "flow" },
    { text: "[serve]      datasets · dashboards · secure shares" },
    { text: "    ↓", tone: "flow" },
    { text: "[ai]         data agent", tone: "ai" },
  ],
  "show projects": [
    ...projects.map((p, i) => ({ text: `${String(i + 1).padStart(2, "0")}  ${p.title}` })),
  ],
  "data quality": [
    status("schema validation", "PASSED"),
    status("null checks", "PASSED"),
    status("duplicate detection", "PASSED"),
    status("referential integrity", "PASSED"),
    status("freshness check", "PASSED"),
    status("row-count validation", "PASSED"),
    { text: "demo output — not a live production check", tone: "dim" },
  ],
  "about abhay": [
    { text: `name        ${site.name}` },
    { text: `role        ${site.role}` },
    { text: `experience  ${site.experience}` },
    { text: "focus       data platforms · pipelines · data quality · data sharing" },
    { text: "stack       snowflake · sql · python · dbt · aws · airflow · mysql" },
    { text: "interest    ai agents on top of enterprise data", tone: "ai" },
  ],
};

const HELP: Line[] = [
  { text: "available commands:", tone: "dim" },
  ...Object.keys(COMMANDS).map((c) => ({ text: `  ${c}` })),
  { text: "  clear" },
];

type Entry = { id: number; command: string; lines: Line[] };

export function Terminal() {
  const [history, setHistory] = useState<Entry[]>([
    { id: 0, command: "pipeline status", lines: COMMANDS["pipeline status"] },
  ]);
  const [input, setInput] = useState("");
  const nextId = useRef(1);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const run = (raw: string) => {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    if (command === "clear") {
      setHistory([]);
      return;
    }
    const lines =
      COMMANDS[command] ??
      (command === "help"
        ? HELP
        : [{ text: `command not found: ${command}`, tone: "warn" as const }, { text: "type 'help' to list commands", tone: "dim" as const }]);
    setHistory((h) => [...h.slice(-5), { id: nextId.current++, command, lines }]);
  };

  return (
    <Section
      id="terminal"
      eyebrow="Terminal"
      title="Or just ask the terminal."
      lead="Click a command or type your own."
    >
      <Reveal>
        <div className="panel overflow-hidden bg-[#0a0f1c]">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <p className="ml-2 font-mono text-[11px] text-dim">{site.handle}@data-platform — zsh</p>
          </div>

          <div
            ref={scroller}
            className="h-80 overflow-y-auto px-4 py-4 font-mono text-xs leading-relaxed sm:text-[13px]"
            role="log"
            aria-live="polite"
            aria-label="Terminal output"
          >
            {history.map((entry) => (
              <div key={entry.id} className="mb-4">
                <p>
                  <Prompt /> <span className="text-ink">{entry.command}</span>
                </p>
                <div className="mt-1.5">
                  {entry.lines.map((line, i) => (
                    <p
                      key={i}
                      className={`row-in whitespace-pre-wrap ${line.tone ? TONE[line.tone] : "text-mute"}`}
                      style={{ animationDelay: `${i * 45}ms` }}
                    >
                      {line.text}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                run(input);
                setInput("");
              }}
            >
              <Prompt />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Terminal command"
                placeholder="type a command"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-ink caret-flow outline-none placeholder:text-dim/70"
              />
            </form>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
            {Object.keys(COMMANDS).map((command) => (
              <button
                key={command}
                type="button"
                onClick={() => run(command)}
                className="rounded-md border border-line bg-raised px-2.5 py-1 font-mono text-xs text-mute transition-colors hover:border-flow/60 hover:text-ink"
              >
                {command}
              </button>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Prompt() {
  return (
    <span className="whitespace-nowrap">
      <span className="text-ok">{site.handle}@data-platform</span>
      <span className="text-dim">:</span>
      <span className="text-flow">~</span>
      <span className="text-dim">$</span>
    </span>
  );
}
