/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['placeimg.com'],
    remotePatterns: [
      { protocol: "https", hostname: "placehold.jp" },
      { protocol: "https", hostname: "images.microcms-assets.io" },
      { protocol: "http", hostname: "example.com" },
      { protocol: "https", hostname: "vkxmusukhyewhjxghhpt.supabase.co" },
    ],
  },
};

export default nextConfig;
