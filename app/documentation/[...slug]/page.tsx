import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { ArrowRightIcon, ChevronLeftIcon } from "@/components/Icons";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { mdxComponents } from "@/components/docs/MdxComponents";
import { getAllDocs, getDocBySlug } from "@/lib/docs";

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  return doc ? { title: doc.title, description: doc.description } : {};
}

export default async function DocumentationPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const docs = getAllDocs();
  const currentIndex = docs.findIndex((item) => item.href === doc.href);
  const previous = currentIndex > 0 ? docs[currentIndex - 1] : null;
  const next = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;

  const { content } = await compileMDX({
    source: doc.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
      },
    },
  });

  return (
    <div className="docs-page container-wide">
      <DocsSidebar docs={docs} currentHref={doc.href} />
      <article className="docs-article">
        <div className="docs-breadcrumb"><Link href="/documentation">Documentation</Link><span>/</span><span>{doc.section}</span></div>
        <header className="docs-title"><span>{doc.section}</span><h1>{doc.title}</h1><p>{doc.description}</p></header>
        <div className="mdx-content">{content}</div>
        <nav className="docs-pagination" aria-label="Documentation pagination">
          {previous ? <Link href={previous.href} className="doc-page-link previous"><span><ChevronLeftIcon /> Previous</span><strong>{previous.title}</strong></Link> : <span />}
          {next ? <Link href={next.href} className="doc-page-link next"><span>Next <ArrowRightIcon /></span><strong>{next.title}</strong></Link> : <span />}
        </nav>
      </article>
      <aside className="docs-toc">
        <strong>On this page</strong>
        <nav>{doc.headings.map((heading) => <a key={heading.id} className={heading.level === 3 ? "level-3" : ""} href={`#${heading.id}`}>{heading.text}</a>)}</nav>
      </aside>
    </div>
  );
}
