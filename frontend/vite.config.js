import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@backend": resolve(__dirname, "../backend"),
      firebase: resolve(__dirname, "node_modules/firebase"),
    },
  },
  optimizeDeps: {
    include: ["firebase/app", "firebase/auth", "firebase/firestore"],
  },
  build: {
    outDir: resolve(__dirname, "../backend/extension/sidepanel"),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
  base: "./",
});
