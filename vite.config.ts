import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
// import { EsLinter, linterPlugin } from 'vite-plugin-linter'

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    react(),
    tsConfigPaths(),
    // linterPlugin({
    //   include: ['./src}/**/*.{ts,tsx}'],
    //   linters: [new EsLinter({ configEnv })],
    // }),
    dts({
      include: ["lib/*"],
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace("/lib", ""),
        content,
      }),
    }),
  ],
  build: {
    lib: {
      entry: resolve("lib", "main.tsx"),
      name: "ReactFeatureFlag",
      formats: ["cjs", "es", "umd", "iife"],
      fileName: (format) => `@igoodie/make-reactive.${format}.js`,
    },
    rollupOptions: {
      external: ["react"],
    },
  },
}));
