import type { NextConfig } from 'next';

const NODE_ENV = process.env.NODE_ENV ?? 'development';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: { turbo: { treeShaking: true } },
  basePath: NODE_ENV === 'development' ? '' : '/instagram',
  distDir: NODE_ENV === 'development' ? '.next' : '../../docs',
};

export default nextConfig;
