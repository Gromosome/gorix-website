import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DOCS_DIRECTORY = path.join(process.cwd(), "content", "docs");

export type DocHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

export type DocMeta = {
  title: string;
  description: string;
  order: number;
  section: string;
  slug: string[];
  href: string;
};

export type Doc = DocMeta & {
  content: string;
  headings: DocHeading[];
};

function collectMdxFiles(directory: string, base = directory): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectMdxFiles(absolutePath, base);
    return entry.name.endsWith(".mdx") ? [path.relative(base, absolutePath)] : [];
  });
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function slugFromRelativePath(relativePath: string) {
  return relativePath
    .replace(/\.mdx$/, "")
    .split(path.sep)
    .map((segment) => segment.replace(/^\d+-/, ""));
}

function extractHeadings(content: string): DocHeading[] {
  return content
    .split("\n")
    .map((line) => line.match(/^(##|###)\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      level: match[1].length as 2 | 3,
      text: match[2].replace(/[`*_~]/g, "").trim(),
      id: slugifyHeading(match[2]),
    }));
}

function readDoc(relativePath: string): Doc {
  const absolutePath = path.join(DOCS_DIRECTORY, relativePath);
  const raw = fs.readFileSync(absolutePath, "utf8");
  const { data, content } = matter(raw);
  const slug = slugFromRelativePath(relativePath);

  return {
    title: String(data.title ?? slug.at(-1)),
    description: String(data.description ?? ""),
    order: Number(data.order ?? 999),
    section: String(data.section ?? "Documentation"),
    slug,
    href: `/documentation/${slug.join("/")}`,
    content,
    headings: extractHeadings(content),
  };
}

export function getAllDocs(): DocMeta[] {
  return collectMdxFiles(DOCS_DIRECTORY)
    .map(readDoc)
    .sort((a, b) => a.order - b.order)
    .map((doc) => ({
      title: doc.title,
      description: doc.description,
      order: doc.order,
      section: doc.section,
      slug: doc.slug,
      href: doc.href,
    }));
}

export function getDocBySlug(slug: string[]): Doc | null {
  const safeSlug = slug.filter((segment) => /^[a-z0-9-]+$/i.test(segment));
  if (safeSlug.length !== slug.length) return null;

  const relativePath = collectMdxFiles(DOCS_DIRECTORY).find((filePath) => {
    const fileSlug = slugFromRelativePath(filePath);
    return fileSlug.length === safeSlug.length && fileSlug.every((segment, index) => segment === safeSlug[index]);
  });

  if (!relativePath) return null;

  return readDoc(relativePath);
}
