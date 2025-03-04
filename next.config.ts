import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // serverExternalPackages: ["@sparticuz/chromium"],
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
      {
        hostname: "upload.wikimedia.org",
      },
      {
        hostname: "img.clerk.com",
      },
      {
        hostname: "developers.elementor.com",
      },
      {
        hostname: "images.pexels.com",
      },
    ],
  },
};
export default nextConfig;
