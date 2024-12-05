/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "dev.ruangobat.id",
      },
      {
        protocol: "https",
        hostname: "dev.ruangobat.id",
      },
      {
        protocol: "http",
        hostname: "api.ruangobat.id",
      },
      {
        protocol: "https",
        hostname: "api.ruangobat.id",
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
};

export default nextConfig;
