"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/Icons";
import type { DocMeta } from "@/lib/docs";

export function DocsSidebar({ docs, currentHref }: { docs: DocMeta[]; currentHref: string }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => docs.filter((doc) => `${doc.title} ${doc.section} ${doc.description}`.toLowerCase().includes(query.toLowerCase())), [docs, query]);
  const sections = Array.from(new Set(filtered.map((doc) => doc.section)));

  return (
    <aside className="docs-sidebar">
      <label className="docs-search">
        <SearchIcon />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search documentation" aria-label="Search documentation" />
      </label>
      <nav aria-label="Documentation navigation">
        {sections.map((section) => (
          <div className="docs-nav-group" key={section}>
            <span>{section}</span>
            {filtered.filter((doc) => doc.section === section).map((doc) => (
              <Link className={currentHref === doc.href ? "docs-nav-link active" : "docs-nav-link"} href={doc.href} key={doc.href}>{doc.title}</Link>
            ))}
          </div>
        ))}
        {filtered.length === 0 && <p className="docs-empty">No matching pages.</p>}
      </nav>
    </aside>
  );
}
