import { describe, expect, it } from "vitest";
import { extractPreview } from "./extract-preview";

describe("extractPreview", () => {
  it("extracts content from a matching UIEditor child block", () => {
    const body =
      '<UIEditor uiId="button" uiBlockId="button-basic">{`\n┌──┐\n│A │\n└──┘\n`}</UIEditor>';
    expect(extractPreview(body, "button-basic")).toBe("┌──┐\n│A │\n└──┘");
  });

  it("extracts content from a matching UIEditor content prop", () => {
    const body =
      '<UIEditor uiId="button" uiBlockId="button-basic" content={String.raw`\n[Button]\n`} />';
    expect(extractPreview(body, "button-basic")).toBe("[Button]");
  });

  it("returns empty string when the preview block id is missing", () => {
    const body =
      '<UIEditor uiId="button" uiBlockId="button-basic">{`\nFirst\n`}</UIEditor>';
    expect(extractPreview(body, "button-group")).toBe("");
  });

  it("returns the specifically requested block instead of the first one", () => {
    const body = [
      "intro",
      '<UIEditor uiId="button" uiBlockId="button-basic">{`\nFirst\n`}</UIEditor>',
      '<UIEditor uiId="button" uiBlockId="button-group">{`\nSecond\n`}</UIEditor>',
      "```",
      "Third",
      "```",
    ].join("\n");
    expect(extractPreview(body, "button-group")).toBe("Second");
  });

  it("returns empty string for empty input", () => {
    expect(extractPreview("", "button-basic")).toBe("");
  });
});
