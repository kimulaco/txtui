import { describe, expect, it } from "vitest";
import { prettyAlignLines } from "./index";

function isWideChar(char: string): boolean {
  const codePoint = char.codePointAt(0);
  if (codePoint === undefined) {
    return false;
  }

  return (
    (codePoint >= 0x1100 && codePoint <= 0x115f) ||
    (codePoint >= 0x2329 && codePoint <= 0x232a) ||
    (codePoint >= 0x2e80 && codePoint <= 0xa4cf) ||
    (codePoint >= 0xac00 && codePoint <= 0xd7a3) ||
    (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
    (codePoint >= 0xfe10 && codePoint <= 0xfe19) ||
    (codePoint >= 0xfe30 && codePoint <= 0xfe6f) ||
    (codePoint >= 0xff01 && codePoint <= 0xff60) ||
    (codePoint >= 0xffe0 && codePoint <= 0xffe6)
  );
}

function getDisplayWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    width += isWideChar(char) ? 2 : 1;
  }
  return width;
}

describe("prettyAlignLines", () => {
  it("pads before ending box border characters", () => {
    const input =
      "│ > text 1               │\n│ > Section 2                  │";
    const output = prettyAlignLines(input);
    const [line1, line2] = output.split("\n");

    expect(line1.endsWith("│")).toBe(true);
    expect(line2.endsWith("│")).toBe(true);
    expect(line1.length).toBe(line2.length);
    expect(line1.includes("│ > text 1")).toBe(true);
  });

  it("keeps trailing newline without adding whitespace-only lines", () => {
    const input = "└────┘\n";
    const output = prettyAlignLines(input);

    expect(output).toBe("└────┘\n");
  });

  it("normalizes CRLF to LF", () => {
    const input = "│ a │\r\n│ bb │";
    const output = prettyAlignLines(input);

    expect(output).toBe("│ a  │\n│ bb │");
  });

  it("extends horizontal borders with box-drawing lines", () => {
    const input = [
      "┌────┐",
      "│ abc        │",
      "├────┤",
      "│ abcdefghij │",
      "└────┘",
    ].join("\n");

    const output = prettyAlignLines(input);
    const lines = output.split("\n");

    expect(lines[0]).toBe("┌────────────┐");
    expect(lines[2]).toBe("├────────────┤");
    expect(lines[4]).toBe("└────────────┘");
  });

  it("aligns nested inner box borders", () => {
    const input = [
      "┌──────────────────────────────┐",
      "│ ┌──────────────────────────┐ │",
      "│ │                          │ │",
      "│ │       ┌──────────┐       │ │",
      "│ │       │  IMA   │       │ │",
      "│ │       └──────────┘       │ │",
      "│ │                          │ │",
      "│ └──────────────────────────┘ │",
      "└──────────────────────────────┘",
    ].join("\n");

    const output = prettyAlignLines(input);
    const lines = output.split("\n");

    expect(lines[4].startsWith("│ │       │  IMA")).toBe(true);
    expect(lines[4].endsWith("│ │")).toBe(true);
    expect(lines[4].endsWith("│   │")).toBe(false);
  });

  it("does not shift leading indentation in nested box layouts", () => {
    const input = [
      "┌──────────────────────────────┐",
      "│ ┌──────────────────────────┐ │",
      "│ │                          │ │",
      "│ │       ┌──────────┐       │ │",
      "│ │       │  IMA   │       │ │",
      "│ │       └──────────┘       │ │",
      "│ │                          │ │",
      "│ └──────────────────────────┘ │",
      "│                              │",
      "│ Card Title                   │",
      "│                              │",
      "│ A card with an image area    │",
      "│ above the content section.   │",
      "│                              │",
      "└──────────────────────────────┘",
    ].join("\n");

    const output = prettyAlignLines(input);
    const lines = output.split("\n");

    expect(lines[1].startsWith("│")).toBe(true);
    expect(lines[2].startsWith("│")).toBe(true);
    expect(/^\s+│/.test(lines[1])).toBe(false);
    expect(/^\s+│/.test(lines[2])).toBe(false);
    expect(lines[8]).toBe("│                              │");
    expect(lines[9]).toBe("│ Card Title                   │");
  });

  it("fixes inner line width based on surrounding top/bottom borders", () => {
    const input = [
      "┌──────────────────────────────┐",
      "│ ┌──────────────────────────┐ │",
      "│ │                          │ │",
      "│ │       ┌──────────┐       │ │",
      "│ │       │  IM   │       │ │",
      "│ │       └──────────┘       │ │",
      "│ │                          │ │",
      "│ └──────────────────────────┘ │",
      "└──────────────────────────────┘",
    ].join("\n");

    const output = prettyAlignLines(input);
    const lines = output.split("\n");

    expect(lines[4]).toBe("│ │       │  IM      │       │ │");
  });

  it("fills bottom border gaps with horizontal lines instead of spaces", () => {
    const input = [
      "┌──────────────────────────────┐",
      "│ ┌──────────────────────────┐ │",
      "│ │                          │ │",
      "│ │       ┌──────────┐       │ │",
      "│ │       │  IMAGE   │       │ │",
      "│ │       └──────────┘       │ │",
      "│ │                          │ │",
      "│ └──────────────────────┘ │",
      "└──────────────────────────────┘",
    ].join("\n");

    const output = prettyAlignLines(input);
    const lines = output.split("\n");

    expect(lines[7]).toContain("└──────────────────────");
    expect(lines[7]).toContain("──────────────────────┘");
    expect(lines[7]).not.toContain("    ┘");
  });

  it("does not distort mixed nested-line and table-line rows", () => {
    const input = [
      "┌──────────────┬───────────────────────┐",
      "│              │                       │",
      "│  ┌────────┐  │ Card Title            │",
      "│  │ IMAGE  │       │",
      "│  └────────┘  │ Horizontal layout     │",
      "│              │ with side-by-side     │",
      "│              │ image and content.    │",
      "│              │                       │",
      "└──────────────┴───────────────────────┘",
    ].join("\n");

    const output = prettyAlignLines(input);
    const lines = output.split("\n");

    expect(lines[3]).toBe("│  │ IMAGE  │       │");
    expect(lines[3].startsWith("│")).toBe(true);
    expect(/^\s+│/.test(lines[3])).toBe(false);
  });

  it("aligns lines with multibyte characters using display width", () => {
    const input = [
      "┌──────────────────────────────┐",
      "│ > 見出し 1                  │",
      "├──────────────────────────────┤",
      "│ > Section 2                  │",
      "├──────────────────────────────┤",
      "│ > Section 3                  │",
      "└──────────────────────────────┘",
    ].join("\n");

    const output = prettyAlignLines(input);
    const lines = output.split("\n");

    expect(lines[1].endsWith("│")).toBe(true);
    expect(lines[3].endsWith("│")).toBe(true);
    expect(getDisplayWidth(lines[1])).toBe(getDisplayWidth(lines[3]));
  });
});
