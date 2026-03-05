import { describe, expect, it } from "vitest";

import {
  comparePreRelease,
  compareSemver,
  isVersionBumped,
  parseSemver,
} from "./check-package-version-bump";

describe("parseSemver", () => {
  it("parses release version", () => {
    expect(parseSemver("1.2.3")).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      pre: null,
    });
  });

  it("parses prerelease and ignores build metadata for comparison shape", () => {
    expect(parseSemver("1.2.3-beta.1+build.5")).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      pre: "beta.1",
    });
  });
});

describe("comparePreRelease", () => {
  it("treats null as stable release and higher than prerelease", () => {
    expect(comparePreRelease(null, "alpha.1")).toBe(1);
    expect(comparePreRelease("alpha.1", null)).toBe(-1);
  });

  it("handles numeric and string identifiers correctly", () => {
    expect(comparePreRelease("1", "alpha")).toBe(-1);
    expect(comparePreRelease("alpha", "1")).toBe(1);
  });

  it("handles length differences when common parts are equal", () => {
    expect(comparePreRelease("alpha", "alpha.1")).toBe(-1);
    expect(comparePreRelease("alpha.1", "alpha")).toBe(1);
  });
});

describe("compareSemver", () => {
  it("returns 1 when left is greater than right", () => {
    expect(compareSemver("1.2.0", "1.1.9")).toBe(1);
  });

  it("returns -1 when left is less than right", () => {
    expect(compareSemver("1.0.0", "1.0.1")).toBe(-1);
  });

  it("handles prerelease precedence", () => {
    expect(compareSemver("1.0.0", "1.0.0-beta.1")).toBe(1);
    expect(compareSemver("1.0.0-beta.2", "1.0.0-beta.10")).toBe(-1);
  });

  it("returns null for invalid semver", () => {
    expect(compareSemver("v1.0.0", "1.0.0")).toBeNull();
  });

  it("returns 0 when versions are equivalent", () => {
    expect(compareSemver("2.0.0", "2.0.0")).toBe(0);
  });
});

describe("isVersionBumped", () => {
  it("passes when head version is bumped", () => {
    expect(isVersionBumped("0.1.0", "0.1.1")).toEqual({ ok: true });
  });

  it("fails when head version is unchanged", () => {
    expect(isVersionBumped("0.1.0", "0.1.0")).toEqual({
      ok: false,
      reason:
        "package.json version must be bumped for PRs to main. base=0.1.0, head=0.1.0",
    });
  });

  it("fails when head version is lower", () => {
    expect(isVersionBumped("0.2.0", "0.1.9")).toEqual({
      ok: false,
      reason:
        "package.json version must be bumped for PRs to main. base=0.2.0, head=0.1.9",
    });
  });

  it("fails when either side is invalid semver", () => {
    expect(isVersionBumped("0.1.0", "v0.1.1")).toEqual({
      ok: false,
      reason: "Invalid semver detected. base=0.1.0, head=v0.1.1",
    });
  });
});
