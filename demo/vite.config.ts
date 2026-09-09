import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const rootDirectory = fileURLToPath(new URL("..", import.meta.url));
const libraryEntry = fileURLToPath(new URL("../lib/main.tsx", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  resolve: {
    alias: {
      "@igoodie/make-reactive": libraryEntry,
      lib: fileURLToPath(new URL("../lib", import.meta.url)),
    },
  },

  server: {
    fs: {
      allow: [rootDirectory],
    },
  },

  // Here, so we can deploy this example to Github Pages
  base: mode === "development" ? "/" : "/make-reactive/",
}));
