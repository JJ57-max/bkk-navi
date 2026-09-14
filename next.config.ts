import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Vercel本番ビルド時のTypeScript型エラーを無視する
    ignoreBuildErrors: true,
  },
  eslint: {
    // Vercel本番ビルド時のESLintエラーを無視する
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;