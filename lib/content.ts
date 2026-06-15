import siteContent from "@/content/site.json";

export const content = siteContent;

export const cdnBaseUrl = (process.env.NEXT_PUBLIC_CDN_BASE_URL ?? "https://www.cdn.gromosome.com").replace(/\/+$/, "");

export function cdnUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${cdnBaseUrl}/${pathOrUrl.replace(/^\/+/, "")}`;
}

export function resolveContentHref(href: string) {
  if (href === "site.repositoryUrl") return content.site.repositoryUrl;
  if (href === "site.packageUrl") return content.site.packageUrl;
  if (href === "site.gromosomeUrl") return content.site.gromosomeUrl;
  if (href === "site.openCollectiveUrl") return content.site.openCollectiveUrl;
  return href;
}

export function formatContentText(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}
