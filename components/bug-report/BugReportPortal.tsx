"use client";

import { BugReportForm } from "@/components/bug-report/BugReportForm";
import { GitHubOAuthPortal } from "@/components/forms/GitHubOAuthPortal";
import { content } from "@/lib/content";

export function BugReportPortal() {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true") {
    return (
      <section className="verification-card">
        <span className="section-kicker">{content.forms.bugReport.oauthKicker}</span>
        <h2>{content.forms.staticExport.title}</h2>
        <p>{content.forms.staticExport.description}</p>
      </section>
    );
  }

  return (
    <GitHubOAuthPortal
      kicker={content.forms.bugReport.oauthKicker}
      description={content.forms.bugReport.oauthDescription}
      accountLabel={content.forms.bugReport.accountLabel}
    >
      {(user) => <BugReportForm user={user} />}
    </GitHubOAuthPortal>
  );
}
