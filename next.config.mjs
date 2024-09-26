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
  async headers() {
    return [
      {
        source: '/_next/image(.*)', // Aplica o cache a todas as imagens otimizadas pelo Next.js
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // Cache por 1 ano
          },
        ],
      },
    ];
  },
};

export default nextConfig;
