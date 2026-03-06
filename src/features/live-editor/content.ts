export function normalizeSlotHtml(value: string): string {
  const trimmed = value.trim();
  const paragraphMatch = trimmed.match(/^<p>([\s\S]*)<\/p>$/i);
  const unwrapped = paragraphMatch ? paragraphMatch[1] : trimmed;
  return unwrapped.replace(/<br\s*\/?>/gi, "\n");
}

export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function resolveEditorContent(slotHtml: string): string {
  return decodeHtmlEntities(normalizeSlotHtml(slotHtml)).replace(
    /\r\n?/g,
    "\n",
  );
}
