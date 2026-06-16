import type { NextConfig } from "next";

const cdnUrl = new URL(process.env.NEXT_PUBLIC_CDN_BASE_URL ?? "https://www.cdn.gromosome.com");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";
const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  output: isGithubPagesBuild ? "export" : undefined,
  trailingSlash: isGithubPagesBuild,
  images: {
    unoptimized: isGithubPagesBuild,
    remotePatterns: [
      {
        protocol: cdnUrl.protocol.replace(":", "") as "http" | "https",
        hostname: cdnUrl.hostname,
        port: cdnUrl.port,
        pathname: "/**",
      },
    ],
  },
  ...(isGithubPagesBuild
    ? {}
    : {
        async headers() {
          return [{ source: "/(.*)", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
