import Link from "next/link";
import { GorixLogo } from "@/components/GorixLogo";
import { content, formatContentText, resolveContentHref } from "@/lib/content";

export function SiteFooter() {
  const footer = content.layout.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <GorixLogo size={42} />
          <p className="footer-copy">{footer.copy}</p>
        </div>
        <div className="footer-links">
          {footer.groups.map((group) => (
            <div key={group.title}>
              <strong>{group.title}</strong>
              {group.links.map((link) => {
                const href = resolveContentHref(link.href);
                return href.startsWith("/") ? (
                  <Link href={href} key={link.label}>{link.label}</Link>
                ) : (
                  <a href={href} target="_blank" rel="noreferrer" key={link.label}>{link.label}</a>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{formatContentText(footer.bottom.copyright, { year })}</span>
        <span>{footer.bottom.tagline}</span>
      </div>
    </footer>
  );
}
