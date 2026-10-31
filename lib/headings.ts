import { isValidElement, type ReactNode } from "react";

export type ArticleHeading = { id: string; text: string };

// Inline markdown as it can appear in a heading: **bold**, `code`, [label](url).
export function plainHeading(markdown: string) {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// The text a rendered heading shows, for MDX headings whose children are elements.
export function nodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children);
  return "";
}

// "## " headings outside code fences, in order. A repeated id is listed once.
// The admin article renderer also turns "# " into <h2>, so it passes includeH1.
export function extractHeadings(markdown: string, { includeH1 = false } = {}): ArticleHeading[] {
  const pattern = includeH1 ? /^#{1,2}\s+(.+?)\s*#*\s*$/ : /^##\s+(.+?)\s*#*\s*$/;
  const headings: ArticleHeading[] = [];
  const seen = new Set<string>();
  let inFence = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }

    const match = inFence ? null : pattern.exec(line);
    if (!match) continue;

    const text = plainHeading(match[1]);
    const id = headingId(text);
    if (id && !seen.has(id)) {
      seen.add(id);
      headings.push({ id, text });
    }
  }

  return headings;
}
