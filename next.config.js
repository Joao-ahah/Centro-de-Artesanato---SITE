/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
  webpack: (config) => {
    // Configuração para resolver problemas com nodemailer
    config.externals.push('nodemailer');
    return config;
  },
};

module.exports = nextConfig; 