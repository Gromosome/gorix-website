"use client";

import { GithubAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type Auth, type User } from "firebase/auth";
import { type ReactNode, useEffect, useState } from "react";
import { GithubIcon, ShieldIcon } from "@/components/Icons";
import { content } from "@/lib/content";
import { getFirebaseAuth } from "@/lib/firebase/client";

type GitHubOAuthPortalProps = {
  kicker: string;
  description: string;
  accountLabel: string;
  children: (user: User) => ReactNode;
};

function isGitHubUser(user: User) {
  return user.providerData.some((provider) => provider.providerId === "github.com");
}

export function GitHubOAuthPortal({ kicker, description, accountLabel, children }: GitHubOAuthPortalProps) {
  const [{ auth, configurationError }] = useState<{ auth: Auth | null; configurationError: string }>(() => {
    try {
      return { auth: getFirebaseAuth(), configurationError: "" };
    } catch (error) {
      return { auth: null, configurationError: error instanceof Error ? error.message : "Firebase is not configured." };
    }
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(auth));
  const [state, setState] = useState<"idle" | "signing-in" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser && isGitHubUser(nextUser) ? nextUser : null);
      setLoading(false);
    });
  }, [auth]);

  async function signInWithGitHub() {
    if (!auth) return;
    setState("signing-in");
    setMessage("");

    try {
      const provider = new GithubAuthProvider();
      provider.addScope("read:user");
      provider.addScope("user:email");
      const credential = await signInWithPopup(auth, provider);
      setUser(credential.user);
      setState("idle");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : content.forms.githubOAuth.errorMessage);
    }
  }

  if (loading) return <div className="portal-loading"><span className="loading-ring" />{content.forms.shared.loadingVerification}</div>;
  if (configurationError) return <div className="configuration-warning"><strong>{content.forms.shared.configurationTitle}</strong><p>{configurationError}</p><p>{content.forms.shared.configurationHelp}</p></div>;

  if (!user) {
    return (
      <section className="verification-card">
        <span className="verification-icon"><ShieldIcon /></span>
        <span className="section-kicker">{kicker}</span>
        <h2>{content.forms.githubOAuth.title}</h2>
        <p>{description}</p>
        <button className="button button-primary" type="button" onClick={signInWithGitHub} disabled={state === "signing-in"}>
          <GithubIcon /> {state === "signing-in" ? content.forms.githubOAuth.signingInLabel : content.forms.githubOAuth.signInLabel}
        </button>
        {message && <p className="form-message error">{message}</p>}
        <small>{content.forms.githubOAuth.footnote}</small>
      </section>
    );
  }

  return (
    <div>
      <div className="portal-account-row">
        <span>{accountLabel} <strong>{user.displayName ?? user.email ?? content.forms.githubOAuth.githubAccountFallback}</strong></span>
        <button type="button" onClick={() => signOut(getFirebaseAuth())}>{content.forms.githubOAuth.useAnotherAccount}</button>
      </div>
      {children(user)}
    </div>
  );
}
