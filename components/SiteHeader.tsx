"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CloseIcon, GithubIcon, MenuIcon, PackageIcon } from "@/components/Icons";
import { GorixLogo } from "@/components/GorixLogo";
import { content } from "@/lib/content";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navigation = content.layout.navigation;
  const header = content.layout.header;
  const siteConfig = content.site;

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-link" aria-label={header.brandAriaLabel} onClick={() => setOpen(false)}>
          <GorixLogo size={40} priority />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={isActive(item.href) ? "nav-link active" : "nav-link"}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a className="icon-link" href={siteConfig.repositoryUrl} target="_blank" rel="noreferrer" aria-label={header.repositoryAriaLabel}>
            <GithubIcon />
          </a>
          <a className="package-link" href={siteConfig.packageUrl} target="_blank" rel="noreferrer">
            <PackageIcon />
            <span>{header.packageLabel}</span>
          </a>
          <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={header.menuAriaLabel}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <div className="container mobile-nav-inner">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className={isActive(item.href) ? "mobile-nav-link active" : "mobile-nav-link"} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <a href={siteConfig.repositoryUrl} target="_blank" rel="noreferrer" className="mobile-nav-link">{header.mobileRepositoryLabel}</a>
            <a href={siteConfig.packageUrl} target="_blank" rel="noreferrer" className="mobile-nav-link">{header.mobilePackageLabel}</a>
          </div>
        </nav>
      )}
    </header>
  );
}
