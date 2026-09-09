import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["lib/main.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  deps: {
    neverBundle: ["react"],
  },
});