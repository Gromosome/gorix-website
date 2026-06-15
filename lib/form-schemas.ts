import { z } from "zod";

const publicGithubRepoUrl = z.string().trim().url("Enter a valid GitHub repository URL").refine((value) => {
  try {
    const url = new URL(value);
    const pathParts = url.pathname.split("/").filter(Boolean);
    return url.hostname === "github.com" && pathParts.length >= 2;
  } catch {
    return false;
  }
}, "Use a public github.com repository URL");

export const codeChallengeSchema = z.object({
  projectName: z.string().trim().min(3, "Project name is required").max(120),
  githubRepoUrl: publicGithubRepoUrl,
  projectDescription: z.string().trim().min(30, "Explain the project in at least 30 characters").max(4000),
  gorixUsage: z.string().trim().min(20, "Describe how Gorix is used").max(3000),
  builderName: z.string().trim().max(100).optional().default(""),
  demoUrl: z.string().trim().url().optional().or(z.literal("")).default(""),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
});

export type CodeChallengeInput = z.infer<typeof codeChallengeSchema>;
