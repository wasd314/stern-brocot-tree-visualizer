/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
  },
  cacheDir: "node_modules/.vite",
  base: "/stern-brocot-tree-visualizer/",
});
