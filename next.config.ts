// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      'pino', 
      'thread-stream', 
      '@reown/appkit', 
      '@reown/appkit-utils',
      '@reown/appkit-controllers'
    ],
  },
  transpilePackages: ['@privy-io/react-auth'],
};

export default nextConfig;