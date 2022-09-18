import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/playground/",
  test: {
    globals: true,
  },
});
