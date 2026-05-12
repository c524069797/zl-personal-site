import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["czl-personal-ui"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // 增加API路由超时时间（仅对自托管有效，Vercel需要配置）
  experimental: {
    externalDir: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
