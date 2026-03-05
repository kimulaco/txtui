import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export type ParsedSemver = {
  major: number;
  minor: number;
  patch: number;
  pre: string | null;
};

export const parseSemver = (version: string): ParsedSemver | null => {
  const match = version.match(
    /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/,
  );
  if (!match) return null;

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    pre: match[4] ?? null,
  };
};

const parseIdentifier = (id: string): number | string => {
  return /^\d+$/.test(id) ? Number(id) : id;
};

export const comparePreRelease = (
  left: string | null,
  right: string | null,
): number => {
  if (left === right) return 0;
  if (left === null) return 1;
  if (right === null) return -1;

  const leftParts = left.split(".").map(parseIdentifier);
  const rightParts = right.split(".").map(parseIdentifier);
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const leftPart = leftParts[index];
    const rightPart = rightParts[index];

    if (leftPart === undefined) return -1;
    if (rightPart === undefined) return 1;
    if (leftPart === rightPart) continue;

    const leftIsNumber = typeof leftPart === "number";
    const rightIsNumber = typeof rightPart === "number";

    if (leftIsNumber && rightIsNumber) return leftPart > rightPart ? 1 : -1;
    if (leftIsNumber && !rightIsNumber) return -1;
    if (!leftIsNumber && rightIsNumber) return 1;
    return leftPart > rightPart ? 1 : -1;
  }

  return 0;
};

export const compareSemver = (left: string, right: string): number | null => {
  const parsedLeft = parseSemver(left);
  const parsedRight = parseSemver(right);
  if (!parsedLeft || !parsedRight) return null;

  if (parsedLeft.major !== parsedRight.major) {
    return parsedLeft.major > parsedRight.major ? 1 : -1;
  }
  if (parsedLeft.minor !== parsedRight.minor) {
    return parsedLeft.minor > parsedRight.minor ? 1 : -1;
  }
  if (parsedLeft.patch !== parsedRight.patch) {
    return parsedLeft.patch > parsedRight.patch ? 1 : -1;
  }
  return comparePreRelease(parsedLeft.pre, parsedRight.pre);
};

export const isVersionBumped = (
  baseVersion: string,
  headVersion: string,
): { ok: boolean; reason?: string } => {
  const comparison = compareSemver(headVersion, baseVersion);
  if (comparison === null) {
    return {
      ok: false,
      reason: `Invalid semver detected. base=${baseVersion}, head=${headVersion}`,
    };
  }

  if (comparison <= 0) {
    return {
      ok: false,
      reason: `package.json version must be bumped for PRs to main. base=${baseVersion}, head=${headVersion}`,
    };
  }

  return { ok: true };
};

export const main = (): void => {
  const baseRef = process.argv[2];
  if (!baseRef) {
    console.error(
      "Usage: tsx scripts/ci/check-package-version-bump.ts <base-ref>",
    );
    process.exit(1);
  }

  execSync(`git fetch --no-tags --depth=1 origin ${baseRef}`, {
    stdio: "inherit",
  });

  const basePackageJson = execSync(`git show origin/${baseRef}:package.json`, {
    encoding: "utf8",
  });
  const headPackageJson = readFileSync("package.json", "utf8");

  const baseVersion = (JSON.parse(basePackageJson) as { version?: string })
    .version;
  const headVersion = (JSON.parse(headPackageJson) as { version?: string })
    .version;

  if (typeof baseVersion !== "string" || typeof headVersion !== "string") {
    console.error("package.json version could not be read.");
    process.exit(1);
  }

  console.log(`Base version: ${baseVersion}`);
  console.log(`Head version: ${headVersion}`);

  const result = isVersionBumped(baseVersion, headVersion);
  if (!result.ok) {
    console.error(result.reason);
    process.exit(1);
  }

  console.log(`Version bump check passed: ${baseVersion} -> ${headVersion}`);
};

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main();
}
