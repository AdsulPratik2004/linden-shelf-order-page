import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.153.78.157"],

  cacheComponents: true,
  partialPrefetching: true,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.entry = () => {
        const entry = config.entry as () => Promise<any>;

        return entry().then((entries) => {
          if (entries["main.js"]) {
            entries["main.js"].unshift("webpack/hot/poll?1000");
          }
          return entries;
        });
      };
    }

    return config;
  },
};

export default nextConfig;