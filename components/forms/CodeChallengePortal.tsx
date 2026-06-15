"use client";

import { CodeChallengeForm } from "@/components/forms/CodeChallengeForm";
import { CodeChallengeProjects } from "@/components/forms/CodeChallengeProjects";
import { GitHubOAuthPortal } from "@/components/forms/GitHubOAuthPortal";
import { content } from "@/lib/content";

export function CodeChallengePortal() {
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
