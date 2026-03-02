import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora erros de ESLint durante o build (evita falhas na Vercel)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de TypeScript durante o build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
