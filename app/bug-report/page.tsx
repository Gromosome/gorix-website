import type { Metadata } from "next";
import { BugIcon } from "@/components/Icons";
import { BugReportPortal } from "@/components/bug-report/BugReportPortal";
import { content } from "@/lib/content";

const pageContent = content.pages.bugReport;

export const metadata: Metadata = pageContent.page;

export default function BugReportPage() {
  return (
    <div className="bug-page">
      <section className="page-hero compact">
        <div className="container page-hero-inner">
          <span className="page-hero-icon"><BugIcon /></span>
          <div><span className="section-kicker">{pageContent.hero.kicker}</span><h1>{pageContent.hero.title}</h1><p>{pageContent.hero.description}</p></div>
        </div>
      </section>
      <section className="section bug-report-section"><div className="container bug-report-container"><BugReportPortal /></div></section>
    </div>
  );
}
