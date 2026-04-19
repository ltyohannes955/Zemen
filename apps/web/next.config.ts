import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@zemen/react', '@zemen/core'],
  output: 'standalone',
};

export default nextConfig;

