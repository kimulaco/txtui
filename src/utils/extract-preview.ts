function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractPreview(body: string, previewBlockId: string): string {
  if (!body || !previewBlockId) {
    return "";
  }

  const blockIdPattern = escapeRegExp(previewBlockId);
  const uiEditorChildRegex = new RegExp(
    `<UIEditor[^>]*\\suiBlockId=["']${blockIdPattern}["'][^>]*>\\s*\\{\`([\\s\\S]*?)\`\\}\\s*<\\/UIEditor>`,
  );
  const childMatch = body.match(uiEditorChildRegex);
  if (childMatch) {
    return childMatch[1].trim();
  }

  const uiEditorContentRegex = new RegExp(
    `<UIEditor[^>]*\\suiBlockId=["']${blockIdPattern}["'][^>]*\\scontent=\\{(?:String\\.raw)?\`([\\s\\S]*?)\`\\}[^>]*\\/>`,
  );
  const contentMatch = body.match(uiEditorContentRegex);
  if (contentMatch) {
    return contentMatch[1].trim();
  }

  return "";
}
