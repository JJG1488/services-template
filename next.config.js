/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Ensure this template builds in isolation
  experimental: {
    turbo: {
      root: __dirname,
    },
  },
};

module.exports = nextConfig;
