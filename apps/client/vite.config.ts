/* eslint-disable prettier/prettier */
/// <reference types='vitest' />

import { lingui } from "@lingui/vite-plugin";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, searchForWorkspaceRoot } from "vite";

export default defineConfig({
  cacheDir: "../../node_modules/.vite/client",

  build: {
    sourcemap: true,
    emptyOutDir: true,
  },

  define: {
    appVersion: JSON.stringify(process.env.npm_package_version),
    'process.env.STRIPE_PUBLIC_KEY': JSON.stringify(process.env.STRIPE_PUBLIC_KEY),
    'process.env.STRIPE_ENABLED': JSON.stringify(process.env.STRIPE_ENABLED),
  },

  server: {
    host: true,
    port: 5173,
    fs: { allow: [searchForWorkspaceRoot(process.cwd())] },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".po": "text",
      },
    },
  },

  plugins: [
    react({
      babel: {
        plugins: ["macros"],
      },
    }),
    lingui(),
    nxViteTsPaths(),
  ],

  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },

  resolve: {
    alias: {
      "@/client/": `${searchForWorkspaceRoot(process.cwd())}/apps/client/src/`,
    },
  },
});
