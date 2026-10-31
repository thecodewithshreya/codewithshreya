// Admin-entered titles may mark code with backticks, e.g. "`var` vs `dynamic` in C#".

export type TitlePart = { text: string; code: boolean };

export function splitTitle(title: string): TitlePart[] {
  const parts: TitlePart[] = [];
  const pattern = /`([^`]+)`/g;
  let last = 0;

  for (const match of title.matchAll(pattern)) {
    if (match.index > last) parts.push({ text: title.slice(last, match.index), code: false });
    parts.push({ text: match[1], code: true });
    last = match.index + match[0].length;
  }

  if (last < title.length) parts.push({ text: title.slice(last), code: false });
  return parts;
}

// For places that cannot show formatting: <title>, meta tags, JSON-LD, RSS, share text.
export function plainTitle(title: string) {
  return title.replace(/`([^`]+)`/g, "$1");
}

// Article categories are stored as enum-like keys; "DotNet" reads as ".NET".
export function categoryLabel(category: string) {
  return category === "DotNet" ? ".NET" : category;
}
