import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

export default defineConfig({
  base: "/breadworks-accounting",
  root,
  server: {
    port: 3000,
  },
  plugins: [
    react(),
  ],

  build: {
    outDir: "../build",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        404: resolve(root, "index.html")
      },
    },
  },
});