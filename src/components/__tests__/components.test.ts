import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
// @ts-ignore - .astro imports are handled by Vite, not tsc
import Header from "../Header.astro";
// @ts-ignore
import Footer from "../Footer.astro";
// @ts-ignore
import Breadcrumb from "../Breadcrumb.astro";
// @ts-ignore
import ComponentCard from "../ComponentCard.astro";

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
});

describe("Footer", () => {
  it("contains the current year and txtui", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Footer);
    const currentYear = new Date().getFullYear().toString();
    expect(result).toContain(currentYear);
    expect(result).toContain("txtui");
  });
});

describe("Breadcrumb", () => {
  it("displays the component name", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Breadcrumb, {
      props: { componentName: "Button" },
    });
    expect(result).toContain("Button");
  });

  it("contains a link to Components", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Breadcrumb, {
      props: { componentName: "Button" },
    });
    expect(result).toContain('href="/"');
    expect(result).toContain("Components");
  });
});

describe("ComponentCard", () => {
  const props = {
    title: "Button",
    description: "A clickable button",
    slug: "button",
    preview: "[ Click me ]",
    tags: ["form", "input"],
  };

  it("renders title, description, preview, and tags", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ComponentCard, { props });
    expect(result).toContain("Button");
    expect(result).toContain("A clickable button");
    expect(result).toContain("[ Click me ]");
    expect(result).toContain('data-tags="form,input"');
  });

  it("links to the component page", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ComponentCard, { props });
    expect(result).toContain('href="/components/button/"');
  });
});
