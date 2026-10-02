"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cx } from "@/lib/cx";

type SectionProps = {
  id: string;
  /** Mono eyebrow, e.g. "STAGE 01 · SOURCES" */
  eyebrow: string;
  title: string;
  lead?: string;
  tone?: "flow" | "ai";
  className?: string;
  children: React.ReactNode | ((live: boolean) => React.ReactNode);
};

/**
 * Page section. Tracks whether it is on screen and exposes that as `data-live`
 * (pauses CSS loops) and as a render-prop argument (pauses JS-driven demos).
 */
export function Section({ id, eyebrow, title, lead, tone = "flow", className, children }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const live = useInView(ref, { margin: "0px 0px -10% 0px" });

  return (
    <section
      id={id}
      ref={ref}
      data-live={live}
      className={cx("relative mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 sm:py-20", className)}
    >
      <Reveal>
        <p className={cx("label mb-4 flex items-center gap-2", tone === "ai" ? "text-ai" : "text-flow")}>
          <span className="inline-block h-px w-6 bg-current opacity-60" />
          {eyebrow}
        </p>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
        {lead && <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">{lead}</p>}
      </Reveal>
      <div className="mt-10 sm:mt-12">{typeof children === "function" ? children(live) : children}</div>
    </section>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Small tag used to mark demonstration values and conceptual content. */
export function DemoTag({ children = "Demo values" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-warn/30 bg-warn/5 px-2 py-0.5 font-mono text-[10px] tracking-wider text-warn uppercase">
      <span className="h-1 w-1 rounded-full bg-warn" />
      {children}
    </span>
  );
}
