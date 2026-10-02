import { ArchitectureDiagram } from "@/components/pipeline/ArchitectureDiagram";
import { Reveal } from "@/components/ui/Section";
import { site } from "@/data/site";

export function ContactSection() {
  return (
    <section id="contact" className="relative mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <Reveal>
        <div className="panel relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-flow/10 blur-3xl"
          />
          <p className="label relative text-flow">Output</p>
          <h2 className="relative mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            Have a data problem?
            <br />
            <span className="bg-gradient-to-r from-flow via-ice to-ai bg-clip-text text-transparent">
              Let&apos;s turn it into a pipeline.
            </span>
          </h2>

          <ArchitectureDiagram
            className="relative mt-10 max-w-2xl lg:items-center"
            ariaLabel="A data problem becomes a pipeline, then trusted data, then a decision"
            nodes={[
              { label: "Data problem" },
              { label: "Pipeline", tone: "flow" },
              { label: "Trusted data", tone: "ok" },
              { label: "Decision", tone: "ai" },
            ]}
          />

          <ul className="relative mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {site.links.map((link) => (
              <li key={link.label}>
                {link.href ? (
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex h-full flex-col rounded-lg border border-line bg-raised px-4 py-3.5 transition-colors hover:border-flow/60"
                  >
                    <span className="flex items-center justify-between text-sm font-medium">
                      {link.label}
                      <span aria-hidden className="text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-flow">
                        →
                      </span>
                    </span>
                    <span className="mt-1 truncate font-mono text-xs text-dim">{link.value}</span>
                  </a>
                ) : (
                  // No URL yet: shown as plain information rather than a dead link
                  <div className="flex h-full flex-col rounded-lg border border-dashed border-line px-4 py-3.5">
                    <span className="text-sm font-medium text-mute">{link.label}</span>
                    <span className="mt-1 truncate font-mono text-xs text-dim">{link.value}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-dim">
        <p>
          {site.name} · {site.role}
        </p>
        <p>pipeline complete · all demo metrics are illustrative</p>
      </footer>
    </section>
  );
}
