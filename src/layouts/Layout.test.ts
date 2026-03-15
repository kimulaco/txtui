import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Layout from "./Layout.astro";

describe("Layout", () => {
  it("renders delegated GA click tracking script", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Layout, {
      props: {
        title: "Test",
      },
      slots: {
        default: "content",
      },
    });

    expect(result).toContain('closest("[data-ga-click-event]")');
    expect(result).toContain("target.dataset.gaClickEventName?.trim()");
    expect(result).toContain('typeof window.gtag !== "function"');
    expect(result).toContain('window.gtag("event", eventName, {');
    expect(result).toContain("ui_id: target.dataset.gaClickEventUiId");
    expect(result).toContain(
      "ui_block_id: target.dataset.gaClickEventUiBlockId",
    );
  });
});
