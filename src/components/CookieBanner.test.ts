import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import { COOKIE_CONSENT_KEY } from "../config";
import CookieBanner from "./CookieBanner.astro";

describe("CookieBanner", () => {
  it("renders the consent message and action buttons", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(CookieBanner);
    expect(result).toContain("Google Analytics");
    expect(result).toContain("Accept");
    expect(result).toContain("Decline");
  });

  it("renders the banner hidden by default", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(CookieBanner);
    expect(result).toContain('id="cookie-banner"');
    expect(result).toMatch(/id="cookie-banner"[^>]*class="[^"]*hidden/);
  });

  it("uses the shared cookie consent key", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(CookieBanner);
    expect(result).toContain(
      `const cookieConsentKey = "${COOKIE_CONSENT_KEY}"`,
    );
  });

  it("updates GA consent to granted on accept", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(CookieBanner);
    expect(result).toContain('analytics_storage: "granted"');
  });
});
