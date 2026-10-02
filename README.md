# Abhay Kevat — Data Engineer Portfolio

A short, single-page portfolio for a general data engineer: an animated pipeline hero, a personal
"about", an animated pipeline run, four project case files, an interactive stack, and a clickable terminal.

[`About me.md`](./About%20me.md) is the original long brief. The site deliberately implements a lighter,
non-domain-specific version of it.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run typecheck
```

Requires Node 20.9 or newer.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Motion. Visualizations are plain SVG and
CSS — no WebGL, no chart libraries.

## Where things live

| Path | What it is |
| --- | --- |
| `src/data/site.ts` | Name, role, **contact links**, "how I work" principles, project content |
| `src/app/page.tsx` | Section order |
| `src/app/globals.css` | Design tokens and the data-flow connector animation |
| `src/components/hero/` | Hero and `HeroPipeline` |
| `src/components/about/` | About text (edit this to change how you describe yourself) |
| `src/components/demo/` | `PipelineRun` — the simulated orchestrated pipeline run |
| `src/components/projects/` | Tabbed project case files (content lives in `src/data/site.ts`) |
| `src/components/skills/` | `SkillMatrix` |
| `src/components/terminal/` | `Terminal` |
| `src/components/contact/` | `ContactSection` |
| `src/components/pipeline/` | Reusable `ArchitectureDiagram`, `PipelineStage`, `DataFlowAnimation` |

## Before publishing

1. Add your resume: put the PDF at `public/resume.pdf`, then in `src/data/site.ts` set the Resume link's `href` to
   `"/resume.pdf"` and its `value` to `"Download PDF"`. Until then it shows "Available on request".
2. Read the About text, project blurbs, and skill descriptions and adjust anything that doesn't match your
   real experience or voice.
3. Every number, record, and dataset name on the site is sample data and is labelled as such. Keep it that way —
   do not swap in real client names, schemas, or production metrics.

## Accessibility and performance

- Honors `prefers-reduced-motion`: packets stop and every demo renders in its finished state.
- Looping animations pause while their section is off-screen.
- All interactive diagrams work with keyboard focus and touch, not only hover.

## SEO and deployment

The site ships with a descriptive title and description, a canonical URL, Open Graph and Twitter preview tags,
a generated preview image (`src/app/opengraph-image.tsx`), `robots.txt`, `sitemap.xml`, and schema.org structured
data that identifies the page as Abhay Kevat's profile and links it to his GitHub and LinkedIn. All of it is
configured in `src/lib/seo.ts`.

The production address is set to `https://abhaykevat.vercel.app` in `src/lib/seo.ts` (`PRODUCTION_URL`).
No environment variables are required to deploy. Two optional ones:

| Variable | When to set it |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Only if the site moves to a different address, e.g. `https://abhaykevat.com` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | The verification code from Google Search Console |

Deploying on Vercel: import the repository, keep the detected "Next.js" preset and default build settings, and
make sure the project's production domain is `abhaykevat.vercel.app`.

After deploying:

1. Open `https://abhaykevat.vercel.app` and confirm it shows this site.
2. Add the site in [Google Search Console](https://search.google.com/search-console), verify it, submit
   `/sitemap.xml`, and use "URL inspection → Request indexing" on the home page.
3. Put the site URL on your LinkedIn profile (Contact info → Website) and your GitHub profile (Website field).
   Links from profiles that already rank for your name are the strongest signal you control.
