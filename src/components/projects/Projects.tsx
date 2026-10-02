"use client";

import { useState } from "react";
import { ArchitectureDiagram } from "@/components/pipeline/ArchitectureDiagram";
import { Reveal, Section } from "@/components/ui/Section";
import { projects } from "@/data/site";
import { cx } from "@/lib/cx";

export function Projects() {
  const [active, setActive] = useState(0);
  const project = projects[active];

  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title="Systems I've engineered."
      lead="Four systems. For each: the problem, the architecture, and the engineering decisions that mattered."
    >
      <Reveal>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4" role="tablist" aria-label="Projects">
          {projects.map((p, i) => (
            <button
              key={p.title}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cx(
                "rounded-lg border px-3.5 py-3 text-left transition-colors duration-200",
                i === active ? "border-flow/70 bg-flow/10" : "border-line bg-panel hover:border-flow/40",
              )}
            >
              <span className={cx("block font-mono text-[11px]", i === active ? "text-flow" : "text-dim")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={cx("mt-1 block text-sm font-medium", i === active ? "text-ink" : "text-mute")}>
                {p.short}
              </span>
            </button>
          ))}
        </div>

        <article key={project.title} className="row-in panel mt-3 overflow-hidden" role="tabpanel">
          <header className="px-5 py-5 sm:px-7 sm:py-6">
            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{project.title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-mute sm:text-base">
              <span className="font-mono text-[11px] tracking-wider text-dim uppercase">Problem </span>
              {project.problem}
            </p>
          </header>

          <div className="border-y border-line bg-bg/40 px-5 py-6 sm:px-7">
            <p className="label mb-4">Architecture</p>
            <ArchitectureDiagram
              ariaLabel={`${project.title} architecture: ${project.architecture.map((n) => n.label).join(", then ")}`}
              nodes={project.architecture.map((n, i) => ({
                ...n,
                tone: i === project.architecture.length - 1 ? "flow" : "idle",
              }))}
            />
          </div>

          <div className="px-5 py-6 sm:px-7">
            <p className="label mb-4">Engineering decisions</p>
            <ol className="grid gap-5 md:grid-cols-3">
              {project.decisions.map((d, i) => (
                <li key={d.title} className="border-l border-flow/40 pl-4">
                  <p className="text-sm font-medium text-ink">
                    <span className="mr-2 font-mono text-[11px] text-flow">{String(i + 1).padStart(2, "0")}</span>
                    {d.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-mute">{d.body}</p>
                </li>
              ))}
            </ol>

            <ul className="mt-6 flex flex-wrap gap-1.5">
              {project.stack.map((tag) => (
                <li key={tag} className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-mute">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </Reveal>
    </Section>
  );
}
