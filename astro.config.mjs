// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import sentry from "@sentry/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://txtui.dev",
  build: {
    inlineStylesheets: "always",
  },
  integrations: [
    mdx(),
    sitemap(),
    sentry({
      enabled: {
        client: true,
        server: false,
      },
      clientInitPath: "./sentry.client.config.ts",
      bundleSizeOptimizations: {
        excludeTracing: true,
      },
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        disable: process.env.PUBLIC_BUILD_ENV !== "production",
      },
    }),
  ],
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
    syntaxHighlight: false,
  },
});
