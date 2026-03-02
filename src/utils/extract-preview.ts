export function extractPreview(body: string): string {
  const match = body.match(/```[\s\S]*?\n([\s\S]*?)```/);
  return match ? match[1].trim() : "";
}
