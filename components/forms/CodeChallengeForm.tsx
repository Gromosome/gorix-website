"use client";

import type { User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { type FormEvent, type ReactNode, useState } from "react";
import { CheckIcon, GithubIcon } from "@/components/Icons";
import { content } from "@/lib/content";
import { codeChallengeSchema, type CodeChallengeInput } from "@/lib/form-schemas";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { getFirebaseErrorMessage } from "@/lib/firebase/errors";

const initialForm: Omit<CodeChallengeInput, "consent"> & { consent: boolean } = {
  projectName: "",
  githubRepoUrl: "",
  projectDescription: "",
  gorixUsage: "",
  builderName: "",
  demoUrl: "",
  consent: false,
  website: "",
};

type FieldName = keyof typeof initialForm;

export function CodeChallengeForm({ user }: { user: User }) {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submissionId, setSubmissionId] = useState("");

  function update(name: FieldName, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    try {
      const parsed = codeChallengeSchema.safeParse(form);
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? content.forms.codeChallenge.submitError);
      if (parsed.data.website) throw new Error(content.forms.codeChallenge.submitError);

      const requestBody = Object.fromEntries(Object.entries(parsed.data).filter(([key]) => key !== "website"));
      const reference = await addDoc(collection(getFirebaseFirestore(), process.env.NEXT_PUBLIC_CODE_CHALLENGE_COLLECTION ?? "codeChallengeProjects"), {
        ...requestBody,
        submitterUid: user.uid,
        submitterEmail: user.email ?? "",
        submitterName: user.displayName ?? "",
        submitterProvider: "github.com",
        verified: false,
        score: 0,
        source: "gorix-website",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSubmissionId(reference.id);
      setState("success");
      setMessage(content.forms.codeChallenge.successMessage);
    } catch (error) {
      setState("error");
      setMessage(getFirebaseErrorMessage(error, content.forms.codeChallenge.submitError));
    }
  }

  if (state === "success") {
    return (
      <section className="report-success">
        <span><CheckIcon /></span>
        <h2>{content.forms.codeChallenge.successTitle}</h2>
        <p>{message}</p>
        <code>{content.forms.shared.referenceLabel} {submissionId}</code>
      </section>
    );
  }

  return (
    <form className="bug-form" onSubmit={handleSubmit}>
      <div className="verified-banner"><CheckIcon /><span><strong>{content.forms.shared.githubAuthenticated}</strong>{user.displayName ?? user.email ?? content.forms.githubOAuth.githubAccountFallback}</span></div>
      <div className="form-section-heading"><span>01</span><div><h2>Public repository</h2><p>Submit an innovative Gorix project hosted on GitHub.</p></div></div>
      <div className="form-grid two-columns">
        <FormField label="Project name" required><input required minLength={3} maxLength={120} value={form.projectName} onChange={(e) => update("projectName", e.target.value)} placeholder="Realtime workflow engine" /></FormField>
        <FormField label="Public GitHub repo" required><input required type="url" value={form.githubRepoUrl} onChange={(e) => update("githubRepoUrl", e.target.value)} placeholder="https://github.com/org/project" /></FormField>
        <FormField label="Builder name"><input maxLength={100} value={form.builderName} onChange={(e) => update("builderName", e.target.value)} placeholder="Team or individual" /></FormField>
        <FormField label="Demo URL"><input type="url" value={form.demoUrl} onChange={(e) => update("demoUrl", e.target.value)} placeholder="https://demo.example.com" /></FormField>
      </div>
      <div className="form-section-heading"><span>02</span><div><h2>Innovation details</h2><p>Explain what makes the project useful and how Gorix is applied.</p></div></div>
      <div className="form-grid">
        <FormField label="Project description" required><textarea required minLength={30} rows={5} value={form.projectDescription} onChange={(e) => update("projectDescription", e.target.value)} /></FormField>
        <FormField label="How the project uses Gorix" required><textarea required minLength={20} rows={5} value={form.gorixUsage} onChange={(e) => update("gorixUsage", e.target.value)} placeholder="Mention routing, DI, validation, database, or other Gorix features." /></FormField>
      </div>
      <div className="honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} /></label></div>
      <label className="consent-field"><input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} required /><span>{content.forms.codeChallenge.consent}</span></label>
      {message && <p className={state === "error" ? "form-message error" : "form-message"}>{message}</p>}
        <div className="form-submit-row"><p>{content.forms.codeChallenge.submitNotice}</p><button className="button button-primary" type="submit" disabled={state === "submitting"}><GithubIcon /> {state === "submitting" ? content.forms.codeChallenge.submitBusy : content.forms.codeChallenge.submitIdle}</button></div>
    </form>
  );
}

function FormField({ label, required, hint, className = "", children }: { label: string; required?: boolean; hint?: string; className?: string; children: ReactNode }) {
  return <label className={`form-field ${className}`}><span>{label}{required && <em>*</em>}</span>{hint && <small>{hint}</small>}{children}</label>;
}
