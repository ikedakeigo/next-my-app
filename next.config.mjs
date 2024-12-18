/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['placeimg.com'],
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "images.microcms-assets.io",
      // },
      {
        protocol: "https",
        hostname: "placehold.jp", // 開発環境用
        // port: "3000", // 開発環境用
        // pathname: "/api/**", // API配下のすべての画像を許可
      },
    ],
  },
};

export default nextConfig;
