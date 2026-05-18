import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  allowedDevOrigins: [], // モバイル用 pnpm devのNetworkに表示されるIPアドレスを指定
  cacheLife: {
    api: {
      stale: 300, // 300秒間クライアントキャッシュを使用する
      revalidate: 600, // 600秒後にサーバーサイドが再検証を行う
      expire: 1800, // 1800秒間再検証がなかった場合にキャッシュを破棄する
    },
  },
};

export default nextConfig;
