// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://txtui.dev",
  integrations: [sitemap()],
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
