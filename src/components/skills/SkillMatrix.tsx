"use client";

import { useState } from "react";
import { Reveal, Section } from "@/components/ui/Section";
import { cx } from "@/lib/cx";

type Skill = { name: string; use: string; worksWith: string[] };
type Group = { name: string; tone: "flow" | "ai"; skills: Skill[] };

const GROUPS: Group[] = [
  {
    name: "Data Engineering",
    tone: "flow",
    skills: [
      { name: "SQL", use: "The core language for everything: transformations, validation queries, performance tuning, and analytics datasets.", worksWith: ["Snowflake", "MySQL", "dbt", "Data Modeling"] },
      { name: "Python", use: "Scripting API extracts, automation, and pipeline logic around the warehouse.", worksWith: ["ETL", "Airflow", "AWS", "Data Pipelines"] },
      { name: "ETL", use: "Extracting from APIs and databases, shaping data before load where the source demands it.", worksWith: ["Python", "Data Pipelines", "MySQL"] },
      { name: "ELT", use: "Landing raw data in Snowflake first, then transforming it inside the warehouse.", worksWith: ["Snowflake", "dbt", "SQL"] },
      { name: "CDC", use: "Capturing inserts, updates, and deletes from MySQL and applying them in Snowflake.", worksWith: ["AWS", "MySQL", "Snowflake"] },
      { name: "Data Pipelines", use: "Automated, incremental flows from source systems to analytics-ready datasets.", worksWith: ["Airflow", "Python", "CDC", "Data Quality"] },
      { name: "Data Modeling", use: "Structuring raw data into consistent models at the right grain for analysis.", worksWith: ["SQL", "dbt", "Data Warehousing"] },
    ],
  },
  {
    name: "Cloud & Data Platforms",
    tone: "flow",
    skills: [
      { name: "Snowflake", use: "Cloud data warehouse used for analytical workloads, data transformation, optimization, secure views, and data sharing.", worksWith: ["SQL", "dbt", "CDC", "Data Warehousing"] },
      { name: "AWS", use: "Cloud infrastructure for ingestion and storage, including DMS for database change capture.", worksWith: ["CDC", "MySQL", "Snowflake"] },
      { name: "MySQL", use: "Operational source database and the origin of CDC streams into the warehouse.", worksWith: ["CDC", "AWS", "SQL"] },
    ],
  },
  {
    name: "Transformation & Orchestration",
    tone: "flow",
    skills: [
      { name: "dbt", use: "Modular SQL models with tests, turning raw warehouse tables into analytics-ready datasets.", worksWith: ["SQL", "Snowflake", "Data Quality", "ELT"] },
      { name: "Airflow", use: "Orchestrating and scheduling pipeline runs and their dependencies.", worksWith: ["Python", "Data Pipelines", "dbt"] },
    ],
  },
  {
    name: "Analytics",
    tone: "flow",
    skills: [
      { name: "Data Warehousing", use: "Layered warehouse design — landing, staging, analytics — built for analytical workloads.", worksWith: ["Snowflake", "Data Modeling", "Reporting"] },
      { name: "Data Quality", use: "Validation built into the pipeline: schema, nulls, duplicates, freshness, and business rules.", worksWith: ["dbt", "SQL", "Data Pipelines"] },
      { name: "Reporting", use: "Delivering analytics-ready datasets that dashboards and reports can rely on.", worksWith: ["Data Visualization", "Data Warehousing", "SQL"] },
      { name: "Data Visualization", use: "Presenting metrics so performance and trends are easy to read.", worksWith: ["Reporting"] },
    ],
  },
  {
    name: "AI",
    tone: "ai",
    skills: [
      { name: "AI Agents", use: "Exploring agents that query and reason over enterprise data.", worksWith: ["Snowflake", "LLM-powered Analytics", "Natural Language Data Analysis"] },
      { name: "Natural Language Data Analysis", use: "Letting people ask questions of their data in plain language.", worksWith: ["AI Agents", "SQL"] },
      { name: "Data Intelligence", use: "Using metadata, quality signals, and metrics to explain what changed and why.", worksWith: ["Data Quality", "AI Agents"] },
      { name: "LLM-powered Analytics", use: "Applying LLMs on top of trusted, modeled datasets to speed up analysis.", worksWith: ["AI Agents", "Data Warehousing"] },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.skills.map((s) => ({ ...s, group: g.name, tone: g.tone })));

export function SkillMatrix() {
  const [selected, setSelected] = useState("Snowflake");
  const skill = ALL.find((s) => s.name === selected) ?? ALL[0];

  return (
    <Section
      id="stack"
      eyebrow="Stack"
      title="The tools, and what I use them for."
      lead="Pick any one to see how it fits into the rest."
    >
      <Reveal>
        <div className="grid gap-5 lg:grid-cols-[1fr_22rem] lg:gap-8">
          <div
            className="panel sticky top-16 z-10 order-first self-start bg-panel px-5 py-4 lg:top-24 lg:order-last lg:py-5"
            aria-live="polite"
          >
            <p className={cx("label", skill.tone === "ai" ? "text-ai" : "text-flow")}>{skill.group}</p>
            <p className="mt-1.5 text-lg font-semibold tracking-tight">{skill.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-mute">{skill.use}</p>
            <p className="label mt-4 hidden lg:block">Works with</p>
            <ul className="mt-2 hidden flex-wrap gap-1.5 lg:flex">
              {skill.worksWith.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => setSelected(name)}
                    className="rounded border border-dashed border-flow/50 px-2 py-0.5 font-mono text-[11px] text-ice transition-colors hover:bg-flow/10"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            {GROUPS.map((group) => (
              <div key={group.name}>
                <p className="label mb-2.5">{group.name}</p>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((s) => {
                    const isSelected = s.name === selected;
                    const isLinked = skill.worksWith.includes(s.name);
                    const select = () => setSelected(s.name);
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onMouseEnter={select}
                        onFocus={select}
                        onClick={select}
                        aria-pressed={isSelected}
                        className={cx(
                          "rounded-lg border px-3 py-2 text-sm transition-colors duration-200",
                          isSelected
                            ? group.tone === "ai"
                              ? "border-ai/70 bg-ai/10 text-ink"
                              : "border-flow/70 bg-flow/10 text-ink"
                            : isLinked
                              ? "border-dashed border-flow/50 bg-raised text-ice"
                              : "border-line bg-raised text-mute hover:text-ink",
                        )}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
