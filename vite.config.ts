import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/playground/",
  test: {
    globals: true,
  },
  server: {
    port: 8080,
  },
});
