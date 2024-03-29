import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

export default defineConfig({
  root,
  server: {
    port: 3000,
  },
  plugins: [
    react(),
  ],

  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        login: resolve(root, "login", "index.html"),
		adminDashboard: resolve(root, "adminDashboard", "index.html"),
		register: resolve(root, "register", "index.html"),
      },
    },
  },
});