/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_EXPORT === 'true';

const nextConfig = {

  reactStrictMode: true,
  output: isProd ? 'export' : undefined,
  distDir: isProd ? '.next-build' : '.next',
  images: { unoptimized: true },
  transpilePackages: [],
  ...(isProd ? {} : {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:3001/api/:path*'
        }
      ];
    }
  }),
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      bufferutil: false,
      'utf-8-validate': false,
    };
    if (isServer) {
      config.externals = [...(config.externals || []), 'bufferutil', 'utf-8-validate'];
    }
    return config;
  },
};

module.exports = nextConfig;
