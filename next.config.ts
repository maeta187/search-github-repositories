import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  allowedDevOrigins: [], // モバイル用 pnpm devのNetworkに表示されるIPアドレスを指定
};

export default nextConfig;
