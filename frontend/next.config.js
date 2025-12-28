/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片配置
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
        pathname: '/**',
      },
    ],
  },
  
  // 性能优化
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // 重写规则 - 让 /admin 直接访问静态文件
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/admin',
          destination: '/admin/index.html',
        },
      ],
    };
  },
};

module.exports = nextConfig;
