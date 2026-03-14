import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
// @ts-ignore - .astro imports are handled by Vite, not tsc
import Header from "./Header.astro";

describe("Header", () => {
  it("contains a logo link to /", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Header);
    expect(result).toContain('href="/"');
    expect(result).toContain("txtui");
  });

  it("contains an About link to /about/", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Header);
    expect(result).toContain('href="/about/"');
    expect(result).toContain("About");
  });

  it("contains a GitHub repository link with external link attributes", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Header);
    expect(result).toContain('href="https://github.com/kimulaco/txtui"');
    expect(result).toContain('aria-label="View txtui on GitHub"');
    expect(result).toContain("<svg");
  });
});
