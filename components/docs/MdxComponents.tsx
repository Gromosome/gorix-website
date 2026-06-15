import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { ExternalLinkIcon } from "@/components/Icons";

function MdxLink({ href = "", children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = href.startsWith("http");
  if (external) {
    return <a href={href} target="_blank" rel="noreferrer" {...props}>{children}<ExternalLinkIcon className="inline-external-icon" /></a>;
  }
  return <Link href={href} {...props}>{children}</Link>;
}

export function Callout({ type = "info", title, children }: { type?: "info" | "warning" | "success"; title?: string; children: ReactNode }) {
  return <aside className={`mdx-callout ${type}`}><strong>{title ?? (type === "warning" ? "Important" : "Note")}</strong><div>{children}</div></aside>;
}

export function Steps({ children }: { children: ReactNode }) {
  return <div className="mdx-steps">{children}</div>;
}

function Pre({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
  return <div className="code-frame"><div className="code-frame-bar"><span /><span /><span /></div><pre {...props}>{children}</pre></div>;
}

export const mdxComponents = {
  a: MdxLink,
  pre: Pre,
  Callout,
  Steps,
};
