import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const UI_TAGS = [
  "form",
  "button",
  "navigation",
  "data-display",
  "feedback",
  "layout",
  "modal",
  "table",
  "grid",
  "list",
  "column",
] as const;

export type UITag = (typeof UI_TAGS)[number];

const uiCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/ui" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.enum(UI_TAGS)),
  }),
});

export const collections = { uiCollection };
