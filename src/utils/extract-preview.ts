export function extractPreview(body: string): string {
  const candidates: Array<{ index: number; content: string }> = [];

  const fenceRegex = /```[\s\S]*?\n([\s\S]*?)```/g;
  for (const match of body.matchAll(fenceRegex)) {
    candidates.push({
      index: match.index ?? Number.MAX_SAFE_INTEGER,
      content: match[1],
    });
  }

  const uiEditorChildRegex =
    /<UIEditor(?:\s[^>]*)?>\s*\{`([\s\S]*?)`\}\s*<\/UIEditor>/g;
  for (const match of body.matchAll(uiEditorChildRegex)) {
    candidates.push({
      index: match.index ?? Number.MAX_SAFE_INTEGER,
      content: match[1],
    });
  }

  const uiEditorContentRegex =
    /<UIEditor[^>]*\scontent=\{(?:String\.raw)?`([\s\S]*?)`\}[^>]*\/>/g;
  for (const match of body.matchAll(uiEditorContentRegex)) {
    candidates.push({
      index: match.index ?? Number.MAX_SAFE_INTEGER,
      content: match[1],
    });
  }

  if (candidates.length === 0) {
    return "";
  }

  candidates.sort((a, b) => a.index - b.index);
  return candidates[0].content.trim();
}
