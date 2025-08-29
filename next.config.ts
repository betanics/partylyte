// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // verhindert, dass ESLint-Fehler (z. B. Hooks/any/@ts-ignore) den Prod-Build abbrechen
    ignoreDuringBuilds: true,
  },
  typescript: {
    // verhindert, dass TypeScript-Fehler den Prod-Build abbrechen
    ignoreBuildErrors: true,
  },
};

export default nextConfig;