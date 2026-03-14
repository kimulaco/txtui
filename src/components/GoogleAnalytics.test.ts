import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
// @ts-ignore - .astro imports are handled by Vite, not tsc
import GoogleAnalytics from "./GoogleAnalytics.astro";

describe("GoogleAnalytics", () => {
  it("renders tracking scripts for a valid measurement id", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(GoogleAnalytics, {
      props: {
        measurementId: "G-ABC123",
      },
    });

    expect(result).toContain(
      'src="https://www.googletagmanager.com/gtag/js?id=G-ABC123"',
    );
    expect(result).toContain('const measurementId = "G-ABC123"');
    expect(result).toContain('gtag("config", measurementId');
  });

  it("renders nothing for an invalid measurement id", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(GoogleAnalytics, {
      props: {
        measurementId: "UA-123456",
      },
    });

    expect(result).toBe("");
  });
});
