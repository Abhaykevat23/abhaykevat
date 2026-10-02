import { site } from "@/data/site";
import { HeroPipeline } from "./HeroPipeline";

const STACK = ["Snowflake", "SQL", "Python", "dbt", "AWS", "Airflow"];

export function Hero() {
  return (
    <section id="top" className="relative mx-auto w-full max-w-5xl px-5 pt-28 pb-16 sm:px-8 lg:pt-36 lg:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          {/* The page's h1 is the name and role, so a search for the name matches the main heading.
              The large tagline below is styled as the headline but is a paragraph. */}
          <h1 className="label mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-mute">
            <span className="text-ink">{site.name}</span>
            <span aria-hidden className="text-dim">/</span>
            <span>{site.role}</span>
          </h1>

          <p className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl">
            Engineering the Data Behind{" "}
            <span className="bg-gradient-to-r from-flow via-ice to-ai bg-clip-text text-transparent">
              Intelligent Decisions.
            </span>
          </p>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">{site.summary}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              Meet the engineer
              <span aria-hidden>↓</span>
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-flow/60"
            >
              View projects
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Core technologies">
            <li className="rounded-md border border-line bg-panel px-2.5 py-1 font-mono text-xs text-ink">
              {site.experience} experience
            </li>
            {STACK.map((tech) => (
              <li key={tech} className="rounded-md border border-line bg-panel px-2.5 py-1 font-mono text-xs text-mute">
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HeroPipeline />
        </div>
      </div>
    </section>
  );
}
