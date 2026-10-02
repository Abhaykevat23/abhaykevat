export const site = {
  name: "Abhay Kevat",
  handle: "abhay",
  role: "Data Engineer & Analytics Developer",
  experience: "~2 years",
  summary:
    "Data Engineer building scalable pipelines, cloud data platforms, analytics systems, and AI-powered data experiences.",
  // Contact links live only here. A link with `href: null` is shown as plain text, not a link.
  // Resume: put the PDF at public/resume.pdf, then set href to "/resume.pdf" and value to "Download PDF".
  links: [
    { label: "GitHub", value: "github.com/Abhaykevat23", href: "https://github.com/Abhaykevat23" },
    { label: "LinkedIn", value: "linkedin.com/in/abhay-kevat", href: "https://www.linkedin.com/in/abhay-kevat/" },
    { label: "Email", value: "abhaykevat23@gmail.com", href: "mailto:abhaykevat23@gmail.com" },
    { label: "Resume", value: "Available on request", href: null },
  ] as { label: string; value: string; href: string | null }[],
};

export const principles = [
  { title: "Build for scale", body: "Solve the pattern once instead of every request as a one-off." },
  { title: "Automate repetition", body: "If I've done it twice by hand, the third time is a pipeline." },
  { title: "Trust the data", body: "Validation is part of the pipeline, not an afterthought." },
  { title: "Design for change", body: "Schemas, sources, and requirements will move. Expect it." },
] as const;

export type Project = {
  title: string;
  short: string;
  problem: string;
  /** Architecture, left to right: component name and what it is built with */
  architecture: { label: string; sub: string }[];
  decisions: { title: string; body: string }[];
  stack: string[];
};

export const projects: Project[] = [
  {
    title: "Multi-Source Data Platform",
    short: "Data platform",
    problem:
      "Many external APIs and operational databases, each with its own schema, cadence, and definition of the same metric, feeding one warehouse that analysts can trust.",
    architecture: [
      { label: "Sources", sub: "APIs · databases" },
      { label: "Ingestion", sub: "Python · Airflow" },
      { label: "Raw", sub: "Snowflake" },
      { label: "Staging", sub: "dbt models" },
      { label: "Marts", sub: "dbt models" },
      { label: "Serving", sub: "BI · AI" },
    ],
    decisions: [
      {
        title: "Incremental loading",
        body: "Each run moves only new and changed data, and late-arriving or restated source data is picked up rather than missed.",
      },
      {
        title: "One conformed model",
        body: "Source-specific schemas are mapped to a shared model in staging, so downstream logic never depends on where a row came from.",
      },
      {
        title: "Built for schema change",
        body: "Source fields get added and renamed. Validation catches the drift at the boundary instead of in a dashboard.",
      },
    ],
    stack: ["Python", "Airflow", "Snowflake", "dbt", "SQL"],
  },
  {
    title: "Multi-Tenant Data Sharing",
    short: "Data sharing",
    problem:
      "Every client needs live access to its own slice of the data. Building a custom pipeline for each request does not scale.",
    architecture: [
      { label: "Governed data", sub: "single source" },
      { label: "Access layer", sub: "entitlements" },
      { label: "Secure views", sub: "per client" },
      { label: "Shares", sub: "Snowflake" },
      { label: "Consumers", sub: "client accounts" },
    ],
    decisions: [
      {
        title: "Standard over custom",
        body: "One architecture serves every client. Onboarding is a configuration change, not a new pipeline.",
      },
      {
        title: "Isolation by design",
        body: "Secure views expose only the rows and columns a client is entitled to, and hide the logic underneath.",
      },
      {
        title: "Automated end to end",
        body: "Pipelines keep shared datasets in sync automatically, with access managed in one place.",
      },
    ],
    stack: ["Snowflake", "Secure views", "Data sharing", "Access control", "SQL"],
  },
  {
    title: "CDC Replication Pipeline",
    short: "CDC pipeline",
    problem:
      "Analytics needs the operational database's current state, updates and deletes included, without hammering the source with full extracts.",
    architecture: [
      { label: "MySQL", sub: "source" },
      { label: "AWS DMS", sub: "change capture" },
      { label: "Stage", sub: "change files" },
      { label: "Pipe", sub: "continuous load" },
      { label: "Stage table", sub: "raw changes" },
      { label: "Main table", sub: "merged" },
    ],
    decisions: [
      {
        title: "Changes, not snapshots",
        body: "Inserts, updates, and deletes are captured at the source and shipped as events instead of re-copying whole tables.",
      },
      {
        title: "Continuous loading",
        body: "Pipes load new change files as they land rather than waiting for a batch window.",
      },
      {
        title: "Deletes handled",
        body: "Staged changes are merged into main tables so the warehouse mirrors the source, removals included.",
      },
    ],
    stack: ["AWS DMS", "MySQL", "Snowflake", "Pipes", "SQL"],
  },
  {
    title: "Data Reliability Engine",
    short: "Data reliability",
    problem:
      "A pipeline that finishes successfully can still deliver wrong data. Success has to mean the data is right, not just that the job ran.",
    architecture: [
      { label: "Dataset", sub: "incoming batch" },
      { label: "Schema", sub: "contract check" },
      { label: "Completeness", sub: "nulls · duplicates" },
      { label: "Freshness", sub: "arrival window" },
      { label: "Business rules", sub: "domain logic" },
      { label: "Trusted data", sub: "released" },
    ],
    decisions: [
      {
        title: "Gates, not reports",
        body: "Checks run inside the pipeline and block bad data, rather than describing it after the fact.",
      },
      {
        title: "Quarantine with a reason",
        body: "A failed batch is isolated with the failing rule attached, while healthy data keeps flowing.",
      },
      {
        title: "Layered checks",
        body: "Schema, completeness, duplicates, freshness, and business rules run in sequence on every dataset.",
      },
    ],
    stack: ["Data quality", "SQL", "dbt", "Snowflake"],
  },
];
