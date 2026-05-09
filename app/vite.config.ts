import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
    assetsInlineLimit: 0,
    rollupOptions: {
      external: ["/zama-sdk.js"],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.wasm')) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  preview: {
    port: 3004,
    host: true,
    allowedHosts: ["blindhire.site"],
  },
  server: {
    port: 3004,
    host: true,
  },
});
