"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { site } from "@/data/site";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#demo", label: "Demo" },
  { href: "#projects", label: "Projects" },
  { href: "#stack", label: "Stack" },
];

/** Fixed header. The line along its bottom edge fills as the page is scrolled. */
export function SiteHeader() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/70 bg-bg/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="font-mono text-sm font-medium tracking-tight text-ink">
          <span className="text-flow">~/</span>
          {site.handle}.kevat
        </a>
        <nav className="flex items-center gap-5 text-sm text-mute" aria-label="Primary">
          {LINKS.map((link) => (
            <a key={link.href} className="hidden transition-colors hover:text-ink sm:block" href={link.href}>
              {link.label}
            </a>
          ))}
          <a
            className="rounded-md border border-line px-3 py-1 text-ink transition-colors hover:border-flow/60"
            href="#contact"
          >
            Contact
          </a>
        </nav>
      </div>
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-flow via-ice to-ai"
        style={{ scaleX: progress }}
      />
    </header>
  );
}
