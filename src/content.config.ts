import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const COMPONENT_TAGS = [
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

export type ComponentTag = (typeof COMPONENT_TAGS)[number];

const components = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/components" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.enum(COMPONENT_TAGS)),
  }),
});

export const collections = { components };
