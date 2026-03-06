export function normalizeSlotHtml(value: string): string {
  const trimmed = value.trim();
  const paragraphMatch = trimmed.match(/^<p>([\s\S]*)<\/p>$/i);
  const unwrapped = paragraphMatch ? paragraphMatch[1] : trimmed;
  return unwrapped.replace(/<br\s*\/?>/gi, "\n");
}

export function decodeHtmlEntities(value: string): string {
  return value.replace(
    /&(lt|gt|amp|quot|#39);/g,
    (entity) =>
      (
        ({
          "&lt;": "<",
          "&gt;": ">",
          "&amp;": "&",
          "&quot;": '"',
          "&#39;": "'",
        }) as Record<string, string>
      )[entity] ?? entity,
  );
}

export function trimSingleEdgeNewlines(value: string): string {
  return value.replace(/^\n/, "").replace(/\n$/, "");
}

export function resolveEditorContent(slotHtml: string): string {
  const normalized = decodeHtmlEntities(normalizeSlotHtml(slotHtml)).replace(
    /\r\n?/g,
    "\n",
  );
  return trimSingleEdgeNewlines(normalized);
}
