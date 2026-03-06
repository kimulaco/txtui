function trimRight(line: string): string {
  return line.replace(/[ \t]+$/g, "");
}

const ALIGN_BOUNDARY_CHARS = new Set(["│", "┐", "┤", "┘"]);

function isBorderEndedLine(line: string): boolean {
  return /[│┤┘┐]$/.test(line);
}

interface BoundaryPoint {
  char: string;
  index: number;
  column: number;
}

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

function charDisplayWidth(char: string): number {
  return isWideChar(char) ? 2 : 1;
}

function getDisplayWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    width += charDisplayWidth(char);
  }
  return width;
}

function getBoundaryPoints(line: string): BoundaryPoint[] {
  const points: BoundaryPoint[] = [];
  let column = 0;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const charWidth = charDisplayWidth(char);

    if (ALIGN_BOUNDARY_CHARS.has(char)) {
      points.push({ char, index, column });
    }

    column += charWidth;
  }

  return points;
}

function getTargetBoundaryIndexes(lines: string[]): number[] {
  const targets: number[] = [];

  for (const line of lines) {
    const points = getBoundaryPoints(line);
    points.forEach((point, index) => {
      targets[index] = Math.max(targets[index] ?? 0, point.column);
    });
  }

  return targets;
}

function getTargetBoundaryIndexesFromRight(lines: string[]): number[] {
  const targets: number[] = [];

  for (const line of lines) {
    const points = getBoundaryPoints(line);
    for (
      let rightOrdinal = 0;
      rightOrdinal < points.length;
      rightOrdinal += 1
    ) {
      const point = points[points.length - 1 - rightOrdinal];
      targets[rightOrdinal] = Math.max(
        targets[rightOrdinal] ?? 0,
        point.column,
      );
    }
  }

  return targets;
}

function getRightEdgeTarget(lines: string[]): number {
  return lines.reduce((max, line) => {
    const points = getBoundaryPoints(line);
    if (points.length === 0) {
      return max;
    }
    return Math.max(max, points[points.length - 1].column);
  }, 0);
}

function isVerticalOnlyMultiBoundaryLine(line: string): boolean {
  const boundaryCount = getBoundaryPoints(line).length;
  return boundaryCount >= 3 && !/[┌┐└┘├┤]/.test(line);
}

function shouldFillWithHorizontal(
  segment: string,
  boundaryChar: string,
): boolean {
  if (!/[┐┤┘]/.test(boundaryChar)) {
    return false;
  }

  const trimmed = segment.trimEnd();
  if (trimmed.endsWith("─")) {
    return true;
  }

  return /^[┌├└]─+$/.test(trimmed) || /^─+$/.test(trimmed);
}

function alignLineToTargets(
  line: string,
  targets: number[],
  rightTargets: number[] = [],
): string {
  const points = getBoundaryPoints(line);
  if (points.length === 0) {
    return line;
  }

  let result = "";
  let cursor = 0;
  let currentColumn = 0;

  points.forEach((point, ordinal) => {
    const segment = line.slice(cursor, point.index);
    const rightOrdinal = points.length - 1 - ordinal;
    const leftTarget = targets[ordinal] ?? point.column;
    const rightTarget = rightTargets[rightOrdinal] ?? point.column;
    const candidateTarget = Math.max(leftTarget, rightTarget, point.column);
    const targetIndex =
      ordinal === 0 && segment.trim() === "" ? point.column : candidateTarget;
    const currentIndex = currentColumn + getDisplayWidth(segment);
    const padLength = Math.max(0, targetIndex - currentIndex);
    const fillChar = shouldFillWithHorizontal(segment, point.char) ? "─" : " ";

    result += segment;
    if (padLength > 0) {
      result += fillChar.repeat(padLength);
    }
    result += point.char;

    cursor = point.index + 1;
    currentColumn = targetIndex + charDisplayWidth(point.char);
  });

  result += line.slice(cursor);
  return result;
}

function alignInnerBoxTriplets(lines: string[]): string[] {
  const aligned = [...lines];

  for (let i = 1; i < lines.length - 1; i += 1) {
    const top = aligned[i - 1];
    const middle = aligned[i];
    const bottom = aligned[i + 1];

    const topMatch = top.match(/^(.*)┌(─+)┐(.*)$/);
    const bottomMatch = bottom.match(/^(.*)└(─+)┘(.*)$/);

    if (!topMatch || !bottomMatch) {
      continue;
    }

    const topPrefix = topMatch[1];
    const topHorizontal = topMatch[2];
    const topSuffix = topMatch[3];
    const bottomPrefix = bottomMatch[1];
    const bottomHorizontal = bottomMatch[2];
    const bottomSuffix = bottomMatch[3];

    if (
      topPrefix !== bottomPrefix ||
      topSuffix !== bottomSuffix ||
      topHorizontal.length !== bottomHorizontal.length
    ) {
      continue;
    }

    const middlePrefixToken = `${topPrefix}│`;
    const middleSuffixToken = `│${topSuffix}`;

    if (
      !middle.startsWith(middlePrefixToken) ||
      !middle.endsWith(middleSuffixToken)
    ) {
      continue;
    }

    const contentStart = middlePrefixToken.length;
    const contentEnd = middle.length - middleSuffixToken.length;
    if (contentEnd < contentStart) {
      continue;
    }

    const middleContent = middle.slice(contentStart, contentEnd);
    const targetWidth = topHorizontal.length;
    const nextContent = trimRight(middleContent).padEnd(targetWidth, " ");
    aligned[i] = `${middlePrefixToken}${nextContent}${middleSuffixToken}`;
  }

  return aligned;
}

export function prettyAlignLines(raw: string): string {
  const normalized = raw.replace(/\r\n?/g, "\n");
  const hasTrailingNewline = normalized.endsWith("\n");
  const rawLines = normalized.split("\n");
  const lines = hasTrailingNewline ? rawLines.slice(0, -1) : rawLines;
  const trimmed = lines.map((line) => trimRight(line));
  const borderLines = trimmed.filter((line) => isBorderEndedLine(line));
  const rightEdgeTarget = getRightEdgeTarget(borderLines);

  const targetsByBoundaryCount = new Map<number, number[]>();
  const rightTargetsByBoundaryCount = new Map<number, number[]>();
  borderLines.forEach((line) => {
    const count = getBoundaryPoints(line).length;
    if (!targetsByBoundaryCount.has(count)) {
      const sameCountLines = borderLines.filter(
        (candidate) => getBoundaryPoints(candidate).length === count,
      );
      targetsByBoundaryCount.set(
        count,
        getTargetBoundaryIndexes(sameCountLines),
      );
      rightTargetsByBoundaryCount.set(
        count,
        getTargetBoundaryIndexesFromRight(sameCountLines),
      );
    }
  });

  const aligned = trimmed.map((line) => {
    if (isVerticalOnlyMultiBoundaryLine(line)) {
      return line;
    }

    const points = getBoundaryPoints(line);
    if (points.length === 0) {
      return line;
    }

    if (points.length === 1) {
      return alignLineToTargets(line, [rightEdgeTarget], [rightEdgeTarget]);
    }

    const targets = targetsByBoundaryCount.get(points.length) ?? [];
    const rightTargets = rightTargetsByBoundaryCount.get(points.length) ?? [];
    return alignLineToTargets(line, targets, rightTargets);
  });

  const result = alignInnerBoxTriplets(aligned).join("\n");

  return hasTrailingNewline ? `${result}\n` : result;
}
