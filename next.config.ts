import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Указываем Turbopack, где именно лежит корень проекта
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: '/@:username',
        destination: '/:username',
      },
    ];
  },
};

export default nextConfig;