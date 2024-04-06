/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Specify the output directory
  distDir: 'build',
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

module.exports = nextConfig;
