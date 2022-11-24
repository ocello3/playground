import { defineConfig } from "vitest/config";

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
});
