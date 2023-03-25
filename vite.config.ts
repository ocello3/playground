import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  base: "/playground/",
  build: {
    target: "esnext",
  },
  test: {
    globals: true,
  },
  server: {
    port: 8080,
  },
  optimizeDeps: {
    include: ["path"],
  },
  resolve: {
    alias: {
      path: path.resolve(__dirname, "src/util/path-stub.js"),
    },
  },
});
