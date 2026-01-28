/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Allow local images from public folder
    unoptimized: false,
  },

  // SEO Redirects
  async redirects() {
    return [
      // Add any URL redirects here if needed
      // Example:
      // {
      //   source: '/old-url',
      //   destination: '/new-url',
      //   permanent: true, // 301 redirect
      // },
    ];
  },
};

export default nextConfig;

