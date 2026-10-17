import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [360, 640, 828, 1080, 1600, 2400],
    imageSizes: [240, 320, 480],
    formats: ['image/avif', 'image/webp'],
  },
  // Staging build: keep every route out of search engines.
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }] }];
  },
};

export default nextConfig;
