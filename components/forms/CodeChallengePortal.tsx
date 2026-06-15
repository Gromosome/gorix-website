"use client";

import { CodeChallengeForm } from "@/components/forms/CodeChallengeForm";
import { CodeChallengeProjects } from "@/components/forms/CodeChallengeProjects";
import { GitHubOAuthPortal } from "@/components/forms/GitHubOAuthPortal";
import { content } from "@/lib/content";

export function CodeChallengePortal() {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true") {
    return (
      <div className="challenge-layout">
        <section className="verification-card">
          <span className="section-kicker">{content.forms.codeChallenge.oauthKicker}</span>
          <h2>{content.forms.staticExport.title}</h2>
          <p>{content.forms.staticExport.description}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="challenge-layout">
      <GitHubOAuthPortal
        kicker={content.forms.codeChallenge.oauthKicker}
        description={content.forms.codeChallenge.oauthDescription}
        accountLabel={content.forms.codeChallenge.accountLabel}
      >
        {(user) => <CodeChallengeForm user={user} />}
      </GitHubOAuthPortal>
      <CodeChallengeProjects />
    </div>
  );
}
