import type { Metadata } from "next";
import { ArrowRightIcon, ShieldIcon } from "@/components/Icons";
import { content } from "@/lib/content";

const pageContent = content.pages.enterpriseSupport;

export const metadata: Metadata = pageContent.page;

export default function EnterpriseSupportPage() {
  return (
    <div className="bug-page">
      <section className="page-hero compact">
        <div className="container page-hero-inner">
          <span className="page-hero-icon"><ShieldIcon /></span>
          <div><span className="section-kicker">{pageContent.hero.kicker}</span><h1>{pageContent.hero.title}</h1><p>{pageContent.hero.description}</p></div>
        </div>
      </section>
      <section className="section cta-section">
        <div className="container cta-panel">
          <div>
            <span className="section-kicker">{pageContent.about.kicker}</span>
            <h2>{pageContent.about.title}</h2>
            <p>{pageContent.about.description}</p>
          </div>
          <div className="cta-actions">
            <a href={pageContent.about.action.href} target="_blank" rel="noreferrer" className="button button-primary">
              {pageContent.about.action.label} <ArrowRightIcon />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
