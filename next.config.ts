import { fileURLToPath } from 'node:url';
import createJiti from 'jiti';
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti('./src/lib/env');

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
      },
    ],
  },
};

export default nextConfig;
