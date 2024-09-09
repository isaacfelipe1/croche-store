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
  };
  
  module.exports = nextConfig;
  