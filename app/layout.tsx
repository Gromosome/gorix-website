import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { cdnUrl, content } from "@/lib/content";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const layoutContent = content.layout;
const openGraphImage = layoutContent.metadata.openGraphImage;
const logoUrl = cdnUrl(content.site.logo.src);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: layoutContent.metadata.title, template: layoutContent.metadata.titleTemplate },
  description: layoutContent.metadata.description,
  keywords: layoutContent.metadata.keywords,
  openGraph: {
    title: layoutContent.metadata.title,
    description: layoutContent.metadata.description,
    type: "website",
    images: [{ url: cdnUrl(openGraphImage.src), width: openGraphImage.width, height: openGraphImage.height, alt: openGraphImage.alt }],
  },
  twitter: { card: "summary_large_image", title: content.site.name, description: layoutContent.metadata.description, images: [cdnUrl(openGraphImage.src)] },
  icons: { icon: logoUrl, apple: logoUrl },
};

export const viewport: Viewport = { themeColor: "#06080a", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="page-noise" aria-hidden="true" />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
