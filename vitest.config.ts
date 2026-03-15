import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.astro", "src/**/*.ts", "scripts/**/*.ts"],
      exclude: [
        "**/index.ts",
        "**/*.d.ts",
        "**/*.test.ts",
        "content.config.ts",
      ],
    },
  },
} as any);
