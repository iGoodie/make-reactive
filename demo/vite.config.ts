import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // Here, so we can deploy this example to Github Pages
  base: mode === "development" ? "/" : "/make-reactive/",
}));
