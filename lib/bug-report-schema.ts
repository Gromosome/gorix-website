import { z } from "zod";

export const bugReportSchema = z.object({
  title: z.string().trim().min(8, "Use at least 8 characters").max(140),
  category: z.enum([
    "routing",
    "dependency-injection",
    "validation",
    "configuration",
    "database",
    "cli",
    "performance",
    "documentation",
    "other",
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  gorixVersion: z.string().trim().min(1).max(40),
  goVersion: z.string().trim().min(1).max(40),
  operatingSystem: z.string().trim().min(2).max(100),
  affectedPackage: z.string().trim().max(160).optional().default(""),
  summary: z.string().trim().min(30, "Explain the issue in at least 30 characters").max(4000),
  stepsToReproduce: z.string().trim().min(20).max(8000),
  expectedBehavior: z.string().trim().min(10).max(4000),
  actualBehavior: z.string().trim().min(10).max(4000),
  reproducibility: z.enum(["always", "often", "sometimes", "once"]),
  codeSample: z.string().trim().max(12000).optional().default(""),
  logs: z.string().trim().max(12000).optional().default(""),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
});

export type BugReportInput = z.infer<typeof bugReportSchema>;
