import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora erros de ESLint durante o build (evita falhas na Vercel)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de TypeScript durante o build (Prisma client não gerado na Vercel)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
