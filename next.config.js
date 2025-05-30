/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Amplifyでのデプロイ時に必要な設定
  experimental: {
    // 最新のNext.jsでは不要になった設定を削除
  },
}

module.exports = nextConfig 