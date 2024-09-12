/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://crochetstoreapi.onrender.com/:path*', // Proxy para o backend
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'croche-store1.s3.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
