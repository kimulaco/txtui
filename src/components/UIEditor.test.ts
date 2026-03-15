import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import UIEditor from "./UIEditor.astro";

describe("UIEditor", () => {
  it("renders the title and resolved content from props", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(UIEditor, {
      props: {
        title: "Button",
        content: "\n[ Click me ]\n",
      },
    });

    expect(result).toContain("Button");
    expect(result).toContain("[ Click me ]");
    expect(result).toContain("data-ui-editor");
    expect(result).toContain('data-code-tool="copy"');
    expect(result).toContain('data-code-tool="reset"');
    expect(result).toContain('data-code-tool="pretty"');
    expect(result).toContain('type="module"');
    expect(result).toContain("UIEditor.astro?astro&type=script");
  });
});
