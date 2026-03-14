import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
// @ts-ignore - .astro imports are handled by Vite, not tsc
import UICard from "./UICard.astro";

describe("UICard", () => {
  const props = {
    title: "Button",
    description: "A clickable button",
    slug: "button",
    preview: "[ Click me ]",
    tags: ["form", "input"],
  };

  it("renders title, description, preview, and tags", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(UICard, { props });
    expect(result).toContain("Button");
    expect(result).toContain("A clickable button");
    expect(result).toContain("[ Click me ]");
    expect(result).toContain('data-tags="form,input"');
  });

  it("links to the ui page", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(UICard, { props });
    expect(result).toContain('href="/ui/button/"');
  });
});
