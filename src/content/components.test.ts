import { describe, expect, it } from "vitest";
import { z } from "astro/zod";

const uiSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
});

describe("ui content schema", () => {
  it("parses valid data", () => {
    const data = {
      title: "Button",
      description: "A simple button ui",
      tags: ["form", "input"],
    };
    expect(uiSchema.parse(data)).toEqual(data);
  });

  it("rejects missing title", () => {
    const data = {
      description: "A simple button ui",
      tags: ["form"],
    };
    expect(() => uiSchema.parse(data)).toThrow();
  });

  it("rejects non-string-array tags", () => {
    const data = {
      title: "Button",
      description: "A simple button ui",
      tags: [1, 2, 3],
    };
    expect(() => uiSchema.parse(data)).toThrow();
  });
});
