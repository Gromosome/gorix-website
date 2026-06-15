import type { Metadata } from "next";
import { GithubIcon } from "@/components/Icons";
import { CodeChallengePortal } from "@/components/forms/CodeChallengePortal";
import { content } from "@/lib/content";

const pageContent = content.pages.codeChallenge;

export const metadata: Metadata = pageContent.page;

export default function CodeChallengePage() {
  return (
    <div className="bug-page">
      <section className="page-hero compact">
        <div className="container page-hero-inner">
          <span className="page-hero-icon"><GithubIcon /></span>
          <div><span className="section-kicker">{pageContent.hero.kicker}</span><h1>{pageContent.hero.title}</h1><p>{pageContent.hero.description}</p></div>
        </div>
      </section>
      <section className="section bug-report-section"><div className="container bug-report-container"><CodeChallengePortal /></div></section>
    </div>
  );
}
