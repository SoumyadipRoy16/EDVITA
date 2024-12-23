/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/dms/image/v2/**',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
        port: '',
        pathname: '/th/id/**',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
        port: '',
        pathname: '/v2/**',
      },
      {
        protocol: 'https',
        hostname: 'www.cntanglewood.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      }
    ],    
  },
}
