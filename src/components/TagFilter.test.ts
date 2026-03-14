import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
// @ts-ignore - .astro imports are handled by Vite, not tsc
import TagFilter from "./TagFilter.astro";

describe("TagFilter", () => {
  it("renders a button for each tag", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(TagFilter, {
      props: {
        tags: ["form", "input"],
      },
    });

    expect(result).toContain('id="tag-filter"');
    expect(result).toContain('data-tag="form"');
    expect(result).toContain('data-tag="input"');
    expect(result).toContain('type="module"');
    expect(result).toContain("TagFilter.astro?astro&type=script");
  });
});
