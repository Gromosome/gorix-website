"use client";

import type { User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { type FormEvent, type ReactNode, useState } from "react";
import { BugIcon, CheckIcon, ExternalLinkIcon } from "@/components/Icons";
import { bugReportSchema, type BugReportInput } from "@/lib/bug-report-schema";
import { content } from "@/lib/content";
import { siteConfig } from "@/lib/constants";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { getFirebaseErrorMessage } from "@/lib/firebase/errors";

const initialForm: Omit<BugReportInput, "consent"> & { consent: boolean } = {
  title: "",
  category: "routing",
  severity: "medium",
  gorixVersion: "",
  goVersion: "",
  operatingSystem: "",
  affectedPackage: "",
  summary: "",
  stepsToReproduce: "",
  expectedBehavior: "",
  actualBehavior: "",
  reproducibility: "always",
  codeSample: "",
  logs: "",
  consent: false,
  website: "",
};

type FieldName = keyof typeof initialForm;

export function BugReportForm({ user }: { user: User }) {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reportId, setReportId] = useState("");

  function update(name: FieldName, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    try {
      const parsed = bugReportSchema.safeParse(form);
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? content.forms.bugReport.submitError);
      if (parsed.data.website) throw new Error(content.forms.bugReport.submitError);

      const report = Object.fromEntries(Object.entries(parsed.data).filter(([key]) => key !== "website"));
      const reference = await addDoc(collection(getFirebaseFirestore(), process.env.NEXT_PUBLIC_BUG_REPORT_COLLECTION ?? "bugReports"), {
        ...report,
        reporterUid: user.uid,
        reporterEmail: user.email ?? "",
        reporterName: user.displayName ?? "",
        reporterProvider: "github.com",
        status: "new",
        source: "gorix-website",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setReportId(reference.id);
      setState("success");
      setMessage(content.forms.bugReport.successMessage);
    } catch (error) {
      setState("error");
      setMessage(getFirebaseErrorMessage(error, content.forms.bugReport.submitError));
    }
  }

  if (state === "success") {
    return (
      <section className="report-success">
        <span><CheckIcon /></span>
        <h2>{content.forms.bugReport.successTitle}</h2>
        <p>{message}</p>
        <code>{content.forms.shared.referenceLabel} {reportId}</code>
        <a href={`${siteConfig.repositoryUrl}/issues`} target="_blank" rel="noreferrer" className="button button-secondary">{content.forms.bugReport.issuesLinkLabel} <ExternalLinkIcon /></a>
      </section>
    );
  }

  return (
    <form className="bug-form" onSubmit={handleSubmit}>
      <div className="verified-banner"><CheckIcon /><span><strong>{content.forms.shared.githubAuthenticated}</strong>{user.displayName ?? user.email ?? content.forms.githubOAuth.githubAccountFallback}</span></div>
      <div className="form-section-heading"><span>{content.forms.bugReport.sections[0].number}</span><div><h2>{content.forms.bugReport.sections[0].title}</h2><p>{content.forms.bugReport.sections[0].description}</p></div></div>
      <div className="form-grid two-columns">
        <FormField label="Bug title" required><input required minLength={8} maxLength={140} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Router resolves a parameter route before a static route" /></FormField>
        <FormField label="Affected area" required><select value={form.category} onChange={(e) => update("category", e.target.value)}><option value="routing">Routing</option><option value="dependency-injection">Dependency injection</option><option value="validation">Validation</option><option value="configuration">Configuration</option><option value="database">Database</option><option value="cli">CLI</option><option value="performance">Performance</option><option value="documentation">Documentation</option><option value="other">Other</option></select></FormField>
        <FormField label="Severity" required><select value={form.severity} onChange={(e) => update("severity", e.target.value)}><option value="low">Low — minor inconvenience</option><option value="medium">Medium — feature partly blocked</option><option value="high">High — core workflow blocked</option><option value="critical">Critical — security/data loss/outage</option></select></FormField>
        <FormField label="Reproducibility" required><select value={form.reproducibility} onChange={(e) => update("reproducibility", e.target.value)}><option value="always">Always</option><option value="often">Often</option><option value="sometimes">Sometimes</option><option value="once">Observed once</option></select></FormField>
      </div>

      <div className="form-section-heading"><span>{content.forms.bugReport.sections[1].number}</span><div><h2>{content.forms.bugReport.sections[1].title}</h2><p>{content.forms.bugReport.sections[1].description}</p></div></div>
      <div className="form-grid three-columns">
        <FormField label="Gorix version" required><input required value={form.gorixVersion} onChange={(e) => update("gorixVersion", e.target.value)} placeholder="v1.0.0" /></FormField>
        <FormField label="Go version" required><input required value={form.goVersion} onChange={(e) => update("goVersion", e.target.value)} placeholder="go1.25 or Greater" /></FormField>
        <FormField label="Operating system" required><input required value={form.operatingSystem} onChange={(e) => update("operatingSystem", e.target.value)} placeholder="Ubuntu 24.04 / amd64" /></FormField>
        <FormField label="Affected package or module" className="span-all"><input value={form.affectedPackage} onChange={(e) => update("affectedPackage", e.target.value)} placeholder="github.com/Gromosome/gorix/gorix/router" /></FormField>
      </div>

      <div className="form-section-heading"><span>{content.forms.bugReport.sections[2].number}</span><div><h2>{content.forms.bugReport.sections[2].title}</h2><p>{content.forms.bugReport.sections[2].description}</p></div></div>
      <div className="form-grid">
        <FormField label="Summary" required hint="Explain the impact and when the problem happens."><textarea required minLength={30} rows={5} value={form.summary} onChange={(e) => update("summary", e.target.value)} /></FormField>
        <FormField label="Steps to reproduce" required hint="Use numbered steps and include the smallest setup possible."><textarea required minLength={20} rows={7} value={form.stepsToReproduce} onChange={(e) => update("stepsToReproduce", e.target.value)} placeholder={'1. Create a Filter\n2. Register Specific Filter \n3. Check its behaviour'} /></FormField>
        <div className="form-grid two-columns">
          <FormField label="Expected behavior" required><textarea required minLength={10} rows={5} value={form.expectedBehavior} onChange={(e) => update("expectedBehavior", e.target.value)} /></FormField>
          <FormField label="Actual behavior" required><textarea required minLength={10} rows={5} value={form.actualBehavior} onChange={(e) => update("actualBehavior", e.target.value)} /></FormField>
        </div>
      </div>

      <div className="form-section-heading"><span>{content.forms.bugReport.sections[3].number}</span><div><h2>{content.forms.bugReport.sections[3].title}</h2><p>{content.forms.bugReport.sections[3].description}</p></div></div>
      <div className="form-grid two-columns">
        <FormField label="Minimal code sample"><textarea rows={9} className="code-input" value={form.codeSample} onChange={(e) => update("codeSample", e.target.value)} placeholder="Paste a minimal reproducible example" /></FormField>
        <FormField label="Logs or stack trace"><textarea rows={9} className="code-input" value={form.logs} onChange={(e) => update("logs", e.target.value)} placeholder="Remove passwords, tokens and personal data" /></FormField>
      </div>

      <div className="honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} /></label></div>
      <label className="consent-field"><input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} required /><span>{content.forms.bugReport.consent}</span></label>
      {message && <p className={state === "error" ? "form-message error" : "form-message"}>{message}</p>}
      <div className="form-submit-row"><p>{content.forms.shared.requiredNotice}</p><button className="button button-primary" type="submit" disabled={state === "submitting"}><BugIcon /> {state === "submitting" ? content.forms.bugReport.submitBusy : content.forms.bugReport.submitIdle}</button></div>
    </form>
  );
}

function FormField({ label, required, hint, className = "", children }: { label: string; required?: boolean; hint?: string; className?: string; children: ReactNode }) {
  return <label className={`form-field ${className}`}><span>{label}{required && <em>*</em>}</span>{hint && <small>{hint}</small>}{children}</label>;
}
