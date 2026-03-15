import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import JsonLd from "./JsonLd.astro";

describe("JsonLd", () => {
  it("renders JSON-LD data in a script tag", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(JsonLd, {
      props: {
        data: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "txtui",
        },
      },
    });

    expect(result).toContain('type="application/ld+json"');
    expect(result).toContain('"@context":"https://schema.org"');
    expect(result).toContain('"name":"txtui"');
  });
});
