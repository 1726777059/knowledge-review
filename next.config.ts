import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  basePath: '/knowledge-review',
  output: 'export', // 静态导出，适配 GitHub Pages
  trailingSlash: true, // 为静态文件添加尾部斜杠
};

export default nextConfig;
