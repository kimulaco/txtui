import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
// @ts-ignore - .astro imports are handled by Vite, not tsc
import Footer from "./Footer.astro";

describe("Footer", () => {
  it("contains the current year and txtui", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Footer);
    const currentYear = new Date().getFullYear().toString();
    expect(result).toContain(currentYear);
    expect(result).toContain("txtui");
  });
});
