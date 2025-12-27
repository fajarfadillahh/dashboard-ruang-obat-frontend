/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev.ruangobat.id",
      },
      {
        protocol: "https",
        hostname: "www.youtube.com",
      },
      {
        protocol: "https",
        hostname: "api.ruangobat.id",
      },
      {
        protocol: "https",
        hostname: "is3.cloudhost.id",
      },
      {
        protocol: "https",
        hostname: "ruangobat.is3.cloudhost.id",
      },
      {
        protocol: "https",
        hostname: "ruangobatdev.is3.cloudhost.id",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: [
      "@nextui-org/react",
      "@phosphor-icons/react",
      "@ckeditor/ckeditor5-react",
      "framer-motion",
    ],
  },
  output: "standalone",
};

export default bundleAnalyzer(nextConfig);
