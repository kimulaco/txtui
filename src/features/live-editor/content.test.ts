import { describe, expect, it } from "vitest";
import {
  decodeHtmlEntities,
  normalizeSlotHtml,
  resolveEditorContent,
} from "./content";

describe("normalizeSlotHtml", () => {
  it("unwraps single paragraph wrappers", () => {
    expect(normalizeSlotHtml("<p>abc</p>")).toBe("abc");
  });

  it("converts br tags to newlines", () => {
    expect(normalizeSlotHtml("<p>a<br>b<br />c</p>")).toBe("a\nb\nc");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeSlotHtml("\n  <p>x</p>  \n")).toBe("x");
  });
});

describe("decodeHtmlEntities", () => {
  it("decodes supported entities", () => {
    expect(decodeHtmlEntities("&lt;a&gt;&amp;&quot;&#39;")).toBe("<a>&\"'");
  });

  it("keeps unknown entities as-is", () => {
    expect(decodeHtmlEntities("&nbsp;")).toBe("&nbsp;");
  });
});

describe("resolveEditorContent", () => {
  it("normalizes paragraph html and CRLF", () => {
    const input = "<p>┌<br>│ A &amp; B │\r\n└</p>";
    expect(resolveEditorContent(input)).toBe("┌\n│ A & B │\n└");
  });
});
