import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Breadcrumb from "./Breadcrumb.astro";

describe("Breadcrumb", () => {
  it("displays the ui name", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Breadcrumb, {
      props: { uiName: "Button" },
    });
    expect(result).toContain("Button");
  });

  it("contains a link to Home", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Breadcrumb, {
      props: { uiName: "Button" },
    });
    expect(result).toContain('href="/"');
    expect(result).toContain("Home");
  });
});
