"use client";

import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ExternalLinkIcon, GithubIcon, PackageIcon } from "@/components/Icons";
import { content, formatContentText } from "@/lib/content";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { getFirebaseErrorMessage } from "@/lib/firebase/errors";

type ChallengeProject = {
  id: string;
  projectName: string;
  githubRepoUrl: string;
  projectDescription: string;
  gorixUsage: string;
  builderName: string;
  demoUrl: string;
  score: number;
};

const pageSize = 6;

function mapProject(id: string, data: Record<string, unknown>): ChallengeProject {
  return {
    id,
    projectName: String(data.projectName ?? ""),
    githubRepoUrl: String(data.githubRepoUrl ?? ""),
    projectDescription: String(data.projectDescription ?? ""),
    gorixUsage: String(data.gorixUsage ?? ""),
    builderName: String(data.builderName ?? ""),
    demoUrl: String(data.demoUrl ?? ""),
    score: Number(data.score ?? 0),
  };
}

export function CodeChallengeProjects() {
  const [projects, setProjects] = useState<ChallengeProject[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setState("loading");
      try {
        const snapshot = await getDocs(query(
          collection(getFirebaseFirestore(), process.env.NEXT_PUBLIC_CODE_CHALLENGE_COLLECTION ?? "codeChallengeProjects"),
          where("verified", "==", true),
        ));
        const orderedProjects = snapshot.docs
          .map((doc) => mapProject(doc.id, doc.data()))
          .sort((first, second) => second.score - first.score || first.projectName.localeCompare(second.projectName));
        const start = (page - 1) * pageSize;
        if (!cancelled) {
          setProjects(orderedProjects.slice(start, start + pageSize));
          setHasNextPage(orderedProjects.length > start + pageSize);
          setState("ready");
          setMessage("");
        }
      } catch (error) {
        if (!cancelled) {
          setState("error");
          setMessage(getFirebaseErrorMessage(error, content.forms.codeChallenge.projects.loadError));
        }
      }
    }

    void loadProjects();
    return () => { cancelled = true; };
  }, [page]);

  return (
    <section className="challenge-projects" aria-labelledby="verified-projects">
      <div className="section-heading">
        <span className="section-kicker">{content.forms.codeChallenge.projects.kicker}</span>
        <h2 id="verified-projects">{content.forms.codeChallenge.projects.title}</h2>
        <p>{content.forms.codeChallenge.projects.description}</p>
      </div>
      {state === "loading" && <div className="portal-loading"><span className="loading-ring" />{content.forms.codeChallenge.projects.loading}</div>}
      {state === "error" && <p className="form-message error">{message}</p>}
      {state === "ready" && projects.length === 0 && <div className="empty-projects"><PackageIcon /><h3>{content.forms.codeChallenge.projects.emptyTitle}</h3><p>{content.forms.codeChallenge.projects.emptyDescription}</p></div>}
      {state === "ready" && projects.length > 0 && (
        <>
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-card-top"><span>{content.forms.codeChallenge.projects.scoreLabel} {project.score}</span>{project.builderName && <small>{project.builderName}</small>}</div>
                <h3>{project.projectName}</h3>
                <p>{project.projectDescription}</p>
                <div className="project-usage"><strong>{content.forms.codeChallenge.projects.usageLabel}</strong><span>{project.gorixUsage}</span></div>
                <div className="project-links">
                  <a href={project.githubRepoUrl} target="_blank" rel="noreferrer"><GithubIcon /> {content.forms.codeChallenge.projects.repositoryLabel}</a>
                  {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer"><ExternalLinkIcon /> {content.forms.codeChallenge.projects.demoLabel}</a>}
                </div>
              </article>
            ))}
          </div>
          <div className="project-pagination">
            <button className="button button-secondary" type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>{content.forms.codeChallenge.projects.previousLabel}</button>
            <span>{formatContentText(content.forms.codeChallenge.projects.pageLabel, { page })}</span>
            <button className="button button-secondary" type="button" disabled={!hasNextPage} onClick={() => setPage((value) => value + 1)}>{content.forms.codeChallenge.projects.nextLabel}</button>
          </div>
        </>
      )}
    </section>
  );
}
