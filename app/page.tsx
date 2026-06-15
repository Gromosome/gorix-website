import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRightIcon, BugIcon, GithubIcon, PackageIcon } from "@/components/Icons";
import { FeatureGrid } from "@/components/FeatureGrid";
import { HeroTerminal } from "@/components/HeroTerminal";
import { ImageSlider } from "@/components/ImageSlider";
import { cdnUrl, content, resolveContentHref } from "@/lib/content";

const home = content.pages.home;

export const metadata: Metadata = home.page;

type HomeHeroSection = {
  component: "hero";
  eyebrow: string;
  title: string;
  highlight: string;
  lead: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
  packageLink: { label: string; href: string };
  terminal: { title: string; ariaLabel: string; code: string; status: string };
};

type HomeSlideShowSection = {
  component: "slideShow";
  kicker: string;
  title: string;
  description: string;
  images: { src: string; alt: string }[];
};

type HomeFeaturesSection = {
  component: "features";
  kicker: string;
  title: string;
  items: { icon: "boxes" | "gauge" | "layers" | "shield" | "terminal"; title: string; copy: string }[];
};

type HomeArchitectureSection = {
  component: "architecture";
  kicker: string;
  title: string;
  copy: string;
  link: { label: string; href: string };
  layers: { title: string; copy: string }[];
};

type HomeCtaSection = {
  component: "cta";
  kicker: string;
  title: string;
  copy: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
};

function getHomeSection<T>(component: string) {
  return home.sections.find((section) => section.component === component) as T;
}

export default function HomePage() {
  const hero = getHomeSection<HomeHeroSection>("hero");
  const slideShow = getHomeSection<HomeSlideShowSection>("slideShow");
  const features = getHomeSection<HomeFeaturesSection>("features");
  const architecture = getHomeSection<HomeArchitectureSection>("architecture");
  const cta = getHomeSection<HomeCtaSection>("cta");

  return (
    <>
      <section className="hero-section">
        <div className="hero-grid container">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> {hero.eyebrow}</div>
            <h1>{hero.title}<br /><span>{hero.highlight}</span></h1>
            <p className="hero-lead">{hero.lead}</p>
            <div className="hero-actions">
              <Link href={hero.primaryAction.href} className="button button-primary">{hero.primaryAction.label} <ArrowRightIcon /></Link>
              <a href={resolveContentHref(hero.secondaryAction.href)} target="_blank" rel="noreferrer" className="button button-secondary"><GithubIcon /> {hero.secondaryAction.label}</a>
            </div>
            <div className="hero-links">
              <a href={resolveContentHref(hero.packageLink.href)} target="_blank" rel="noreferrer"><PackageIcon /> {hero.packageLink.label}</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-logo-glow" aria-hidden="true" />
            <Image className="hero-logo" src={cdnUrl(content.site.logo.src)} alt={content.site.logo.alt} width={300} height={300} priority />
            <HeroTerminal {...hero.terminal} />
          </div>
        </div>
        <div className="hero-grid-lines" aria-hidden="true" />
      </section>

      <section className="section section-tight">
        <div className="container section-heading centered">
          <span className="section-kicker">{slideShow.kicker}</span>
          <h2>{slideShow.title}</h2>
          <p>{slideShow.description}</p>
        </div>
        <div className="container"><ImageSlider slides={slideShow.images} /></div>
      </section>

      <section className="section feature-section">
        <div className="container section-heading">
          <span className="section-kicker">{features.kicker}</span>
          <h2>{features.title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h2>
        </div>
        <div className="container"><FeatureGrid features={features.items} /></div>
      </section>

      <section className="section architecture-section">
        <div className="container architecture-grid">
          <div>
            <span className="section-kicker">{architecture.kicker}</span>
            <h2>{architecture.title}</h2>
            <p className="architecture-copy">{architecture.copy}</p>
            <Link href={architecture.link.href} className="text-link">{architecture.link.label} <ArrowRightIcon /></Link>
          </div>
          <div className="architecture-stack" aria-label="Gorix architecture layers">
            {architecture.layers.map((layer) => <div key={layer.title}><strong>{layer.title}</strong><span>{layer.copy}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-panel">
          <div>
            <span className="section-kicker">{cta.kicker}</span>
            <h2>{cta.title}</h2>
            <p>{cta.copy}</p>
          </div>
          <div className="cta-actions">
            <Link href={cta.primaryAction.href} className="button button-primary">{cta.primaryAction.label} <ArrowRightIcon /></Link>
            <Link href={cta.secondaryAction.href} className="button button-secondary"><BugIcon /> {cta.secondaryAction.label}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
