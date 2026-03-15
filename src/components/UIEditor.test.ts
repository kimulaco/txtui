import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import UIEditor from "./UIEditor.astro";

describe("UIEditor", () => {
  it("renders the title and resolved content from props", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(UIEditor, {
      props: {
        uiId: "button",
        uiBlockId: "button-basic",
        title: "Button",
        content: "\n[ Click me ]\n",
      },
    });

    expect(result).toContain("Button");
    expect(result).toContain("[ Click me ]");
    expect(result).toContain("data-ui-editor");
    expect(result).toContain(
      'data-code-tool="copy" data-ga-click-event data-ga-click-event-name="ui_copy_click" data-ga-click-event-ui-id="button" data-ga-click-event-ui-block-id="button-basic"',
    );
    expect(result).toContain(
      'data-code-tool="reset" data-ga-click-event data-ga-click-event-name="ui_reset_click" data-ga-click-event-ui-id="button" data-ga-click-event-ui-block-id="button-basic"',
    );
    expect(result).toContain(
      'data-code-tool="pretty" data-ga-click-event data-ga-click-event-name="ui_pretty_click" data-ga-click-event-ui-id="button" data-ga-click-event-ui-block-id="button-basic"',
    );
    expect(result).toContain('type="module"');
    expect(result).toContain("UIEditor.astro?astro&type=script");
  });
});
