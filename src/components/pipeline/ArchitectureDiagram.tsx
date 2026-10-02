import { Fragment } from "react";
import { cx } from "@/lib/cx";

type Orientation = "h" | "v" | "r";
type Tone = "flow" | "ai" | "ok" | "warn" | "bad" | "idle";

const toneText: Record<Tone, string> = {
  flow: "text-flow",
  ai: "text-ai",
  ok: "text-ok",
  warn: "text-warn",
  bad: "text-bad",
  idle: "text-dim",
};

/** The wire between two stages, with packets travelling along it. */
export function DataFlowAnimation({
  orientation = "r",
  tone = "flow",
  packets = 2,
  duration = 2.2,
  active = true,
  className,
}: {
  /** h = horizontal, v = vertical, r = vertical on mobile / horizontal on desktop */
  orientation?: Orientation;
  tone?: Tone;
  packets?: number;
  duration?: number;
  active?: boolean;
  className?: string;
}) {
  return (
    <span aria-hidden className={cx("flow-link", `flow-${orientation}`, toneText[tone], className)}>
      {active &&
        Array.from({ length: packets }, (_, i) => (
          <i
            key={i}
            className="pk"
            style={
              {
                "--dur": `${duration}s`,
                "--delay": `${(-duration * i) / packets}s`,
              } as React.CSSProperties
            }
          />
        ))}
    </span>
  );
}

const toneBorder: Record<Tone, string> = {
  flow: "border-flow/50 shadow-[0_0_24px_-8px] shadow-flow/50",
  ai: "border-ai/50 shadow-[0_0_24px_-8px] shadow-ai/50",
  ok: "border-ok/50 shadow-[0_0_24px_-8px] shadow-ok/40",
  warn: "border-warn/50",
  bad: "border-bad/50",
  idle: "border-line",
};

/** A single node in a pipeline. Renders as a button when `onSelect` is given. */
export function PipelineStage({
  label,
  sub,
  tone = "idle",
  selected = false,
  onSelect,
  compact = false,
  className,
}: {
  label: string;
  sub?: string;
  tone?: Tone;
  selected?: boolean;
  onSelect?: () => void;
  /** Smaller padding and type, for diagrams that must fit a narrow card */
  compact?: boolean;
  className?: string;
}) {
  const classes = cx(
    "flex-none rounded-lg border bg-raised text-center transition-colors duration-300",
    compact ? "px-1.5 py-1.5 sm:px-2" : "px-3 py-2",
    selected ? toneBorder[tone === "idle" ? "flow" : tone] : tone === "idle" ? "border-line" : toneBorder[tone],
    onSelect && "cursor-pointer hover:border-flow/60",
    className,
  );
  const body = (
    <>
      <span className={cx("block font-mono font-medium whitespace-nowrap text-ink", compact ? "text-[11px]" : "text-xs")}>
        {label}
      </span>
      {sub && <span className="mt-0.5 block font-mono text-[10px] whitespace-nowrap text-dim">{sub}</span>}
    </>
  );
  return onSelect ? (
    <button type="button" onClick={onSelect} aria-pressed={selected} className={classes}>
      {body}
    </button>
  ) : (
    <div className={classes}>{body}</div>
  );
}

export type DiagramNode = { label: string; sub?: string; tone?: Tone };

/** A linear architecture: stages joined by animated data flow. */
export function ArchitectureDiagram({
  nodes,
  orientation = "r",
  tone = "flow",
  compact = false,
  className,
  ariaLabel,
}: {
  nodes: DiagramNode[];
  orientation?: Orientation;
  tone?: Tone;
  compact?: boolean;
  className?: string;
  ariaLabel: string;
}) {
  const direction =
    orientation === "h" ? "flex-row" : orientation === "v" ? "flex-col" : "flex-col lg:flex-row";
  return (
    <div role="img" aria-label={ariaLabel} className={cx("flex items-center", direction, className)}>
      {nodes.map((node, i) => (
        <Fragment key={node.label}>
          {i > 0 && (
            <DataFlowAnimation
              orientation={orientation}
              tone={tone}
              duration={2 + (i % 3) * 0.3}
              className={compact ? "min-w-3" : undefined}
            />
          )}
          <PipelineStage label={node.label} sub={node.sub} tone={node.tone ?? "idle"} compact={compact} />
        </Fragment>
      ))}
    </div>
  );
}
