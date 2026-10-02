import { About } from "@/components/about/About";
import { ContactSection } from "@/components/contact/ContactSection";
import { Backdrop } from "@/components/layout/Backdrop";
import { PipelineRun } from "@/components/demo/PipelineRun";
import { Hero } from "@/components/hero/Hero";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Projects } from "@/components/projects/Projects";
import { SkillMatrix } from "@/components/skills/SkillMatrix";
import { Terminal } from "@/components/terminal/Terminal";

export default function Home() {
  return (
    <>
      <Backdrop />
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <PipelineRun />
        <Projects />
        <SkillMatrix />
        <Terminal />
        <ContactSection />
      </main>
    </>
  );
}
