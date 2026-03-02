import { describe, expect, it } from "vitest";
import { z } from "astro/zod";

const componentSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
});

describe("component content schema", () => {
  it("parses valid data", () => {
    const data = {
      title: "Button",
      description: "A simple button component",
      tags: ["form", "input"],
    };
    expect(componentSchema.parse(data)).toEqual(data);
  });

  it("rejects missing title", () => {
    const data = {
      description: "A simple button component",
      tags: ["form"],
    };
    expect(() => componentSchema.parse(data)).toThrow();
  });

  it("rejects non-string-array tags", () => {
    const data = {
      title: "Button",
      description: "A simple button component",
      tags: [1, 2, 3],
    };
    expect(() => componentSchema.parse(data)).toThrow();
  });
});
