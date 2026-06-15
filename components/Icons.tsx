import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export const ArrowRightIcon = (props: IconProps) => <IconBase {...props}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></IconBase>;
export const GithubIcon = (props: IconProps) => <IconBase {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 2a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4"/><path d="M8 19c-3 .9-3-1.5-4-2"/></IconBase>;
export const PackageIcon = (props: IconProps) => <IconBase {...props}><path d="m16.5 9.4-9-5.2"/><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/></IconBase>;
export const MenuIcon = (props: IconProps) => <IconBase {...props}><path d="M4 6h16M4 12h16M4 18h16"/></IconBase>;
export const CloseIcon = (props: IconProps) => <IconBase {...props}><path d="m6 6 12 12M18 6 6 18"/></IconBase>;
export const ChevronLeftIcon = (props: IconProps) => <IconBase {...props}><path d="m15 18-6-6 6-6"/></IconBase>;
export const ChevronRightIcon = (props: IconProps) => <IconBase {...props}><path d="m9 18 6-6-6-6"/></IconBase>;
export const SearchIcon = (props: IconProps) => <IconBase {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></IconBase>;
export const ShieldIcon = (props: IconProps) => <IconBase {...props}><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z"/><path d="m9 12 2 2 4-4"/></IconBase>;
export const LayersIcon = (props: IconProps) => <IconBase {...props}><path d="m12.8 2.7 8 4a1 1 0 0 1 0 1.8l-8 4a2 2 0 0 1-1.8 0l-8-4a1 1 0 0 1 0-1.8l8-4a2 2 0 0 1 1.8 0Z"/><path d="m22 12.5-9.2 4.6a2 2 0 0 1-1.8 0L2 12.5"/><path d="m22 17.5-9.2 4.6a2 2 0 0 1-1.8 0L2 17.5"/></IconBase>;
export const GaugeIcon = (props: IconProps) => <IconBase {...props}><path d="m12 14 4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/><path d="M6.5 17h11"/></IconBase>;
export const BoxesIcon = (props: IconProps) => <IconBase {...props}><path d="M2 12.5 7 15l5-2.5-5-2.5-5 2.5Z"/><path d="m12 7.5 5 2.5 5-2.5L17 5l-5 2.5Z"/><path d="m12 17.5 5 2.5 5-2.5-5-2.5-5 2.5Z"/><path d="M2 17.5 7 20l5-2.5"/><path d="M2 7.5 7 5l5 2.5"/></IconBase>;
export const TerminalIcon = (props: IconProps) => <IconBase {...props}><path d="m4 17 6-6-6-6"/><path d="M12 19h8"/></IconBase>;
export const BugIcon = (props: IconProps) => <IconBase {...props}><path d="m8 2 1.9 1.9"/><path d="M14.1 3.9 16 2"/><path d="M9 7.1V6a3 3 0 0 1 6 0v1.1"/><rect width="12" height="13" x="6" y="7" rx="6"/><path d="M3 13h3M18 13h3M4 7l2.4 1.4M17.6 8.4 20 7M4 19l2.4-1.4M17.6 17.6 20 19M12 20v-9"/></IconBase>;
export const CheckIcon = (props: IconProps) => <IconBase {...props}><path d="m20 6-11 11-5-5"/></IconBase>;
export const ExternalLinkIcon = (props: IconProps) => <IconBase {...props}><path d="M15 3h6v6"/><path d="m10 14 11-11"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></IconBase>;
