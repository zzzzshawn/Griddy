/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-fd21440a971545968d1aa765101f1c1e.r2.dev',
        port: '',
        pathname: '/apollo/images/**',
      },
    ],
  },
}

module.exports = nextConfig 