import { describe, expect, it } from "vitest";
import { extractPreview } from "./extract-preview";

describe("extractPreview", () => {
  it("extracts content from a code block", () => {
    const body = "Some text\n```\nHello World\n```\nMore text";
    expect(extractPreview(body)).toBe("Hello World");
  });

  it("extracts content from a code block with language identifier", () => {
    const body = "Some text\n```txt\nHello World\n```\nMore text";
    expect(extractPreview(body)).toBe("Hello World");
  });

  it("returns the first code block when multiple exist", () => {
    const body = "```\nFirst\n```\ntext\n```\nSecond\n```";
    expect(extractPreview(body)).toBe("First");
  });

  it("returns empty string when no code block exists", () => {
    const body = "No code blocks here";
    expect(extractPreview(body)).toBe("");
  });

  it("returns empty string for empty input", () => {
    expect(extractPreview("")).toBe("");
  });
});
