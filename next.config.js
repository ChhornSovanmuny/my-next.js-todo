/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Amplifyでのデプロイ時に必要な設定
  experimental: {
    // サーバーコンポーネントを有効化
    serverComponents: true,
    // アプリケーションのルーティングを有効化
    appDir: true,
  },
}

module.exports = nextConfig 