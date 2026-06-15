import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/docs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pages = ["", "/documentation", "/bug-report", "/enterprise-support", "/code-challenge"];
  return [
    ...pages.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.8 })),
    ...getAllDocs().map((doc) => ({ url: `${base}${doc.href}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
