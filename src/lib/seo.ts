import { site } from "@/data/site";

/** The production address. Change this (or set NEXT_PUBLIC_SITE_URL) if the site moves to a custom domain. */
const PRODUCTION_URL = "https://abhaykevat.vercel.app";

/**
 * The site's public address, used for canonical URLs, the sitemap, and social previews.
 * It is the production address everywhere — including preview deployments and local builds —
 * so search engines are always pointed at the one real site.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_URL).replace(/\/$/, "");

export const seo = {
  title: `${site.name} — Data Engineer | Snowflake, dbt, Airflow, AWS`,
  description: `${site.name} is a data engineer and analytics developer building data pipelines, cloud data warehouses, and data quality systems with Snowflake, dbt, Airflow, Python, and AWS. Portfolio, projects, and contact.`,
  keywords: [
    site.name,
    `${site.name} data engineer`,
    `${site.name} portfolio`,
    "Data Engineer",
    "Analytics Developer",
    "Snowflake",
    "dbt",
    "Airflow",
    "AWS",
    "Python",
    "SQL",
    "ETL",
    "ELT",
    "CDC",
    "data pipelines",
    "data warehousing",
    "data quality",
  ],
  knowsAbout: [
    "Data engineering",
    "Data pipelines",
    "Data warehousing",
    "Snowflake",
    "dbt",
    "Apache Airflow",
    "Amazon Web Services",
    "SQL",
    "Python",
    "Change data capture",
    "Data quality",
    "Analytics engineering",
  ],
};

const profiles = site.links
  .map((link) => link.href)
  .filter((href): href is string => !!href && href.startsWith("http"));

/**
 * Structured data that tells search engines this site is the profile page of a person,
 * and links that person to their GitHub and LinkedIn profiles.
 */
export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: site.name,
      url: siteUrl,
      jobTitle: "Data Engineer",
      description: seo.description,
      image: `${siteUrl}/opengraph-image`,
      sameAs: profiles,
      knowsAbout: seo.knowsAbout,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: site.name,
      alternateName: `${site.name} — Data Engineer Portfolio`,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: siteUrl,
      name: seo.title,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#person` },
      mainEntity: { "@id": `${siteUrl}/#person` },
    },
  ],
};
