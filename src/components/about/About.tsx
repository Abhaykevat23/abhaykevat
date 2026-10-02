import { Reveal, Section } from "@/components/ui/Section";
import { principles } from "@/data/site";

export function About() {
  return (
    <Section id="about" eyebrow="About" title="I make sure the number on the dashboard is actually true.">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <Reveal className="space-y-5 text-base leading-relaxed text-mute sm:text-lg">
          <p>
            Most people meet data at the very end: a chart, a report, an answer. I work on everything that happens
            before that. Getting data out of systems that were never built to talk to each other, fixing what
            arrives broken, and shaping it into something a team can rely on without a second thought.
          </p>
          <p>
            I&apos;m <span className="text-ink">Abhay Kevat</span>, a data engineer with around two years of building
            pipelines and warehouses on <span className="text-ink">Snowflake, dbt, Airflow, and AWS</span>. I enjoy
            the unglamorous parts of the job: the load that never double-counts, the check that catches a bad file
            before anyone else has to.
          </p>
          <p>
            Good data engineering is mostly invisible. When it works, nobody notices. Lately I&apos;m exploring what
            comes next: <span className="text-ai">AI agents that answer questions straight from trusted data</span>.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="label mb-4">How I work</p>
          <ol className="space-y-px overflow-hidden rounded-[14px] border border-line bg-line">
            {principles.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[2rem_1fr] bg-panel px-4 py-3.5">
                <span className="pt-0.5 font-mono text-[11px] text-flow">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-sm font-medium text-ink">{p.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-mute">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
