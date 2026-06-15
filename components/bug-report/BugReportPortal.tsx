"use client";

import { BugReportForm } from "@/components/bug-report/BugReportForm";
import { GitHubOAuthPortal } from "@/components/forms/GitHubOAuthPortal";
import { content } from "@/lib/content";

export function BugReportPortal() {
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
