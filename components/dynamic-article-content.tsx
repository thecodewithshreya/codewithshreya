import type { ReactNode } from "react";
import { ArticleQuiz } from "@/components/mdx/article-quiz";
import { CodeBlock } from "@/components/code-block";
import { headingId, plainHeading } from "@/lib/headings";
import { parseQuizText, type QuizQuestion } from "@/lib/quiz-format";

type DynamicArticleContentProps = {
  content: string;
};

type ParsedBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "quote"; text: string }
  | { type: "code"; code: string }
  | { type: "image"; alt: string; src: string }
  | { type: "quiz"; questions: QuizQuestion[] }
  | { type: "notice"; text: string };

export function DynamicArticleContent({ content }: DynamicArticleContentProps) {
  const blocks = parseMarkdown(content);

  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          if (block.level === 2) {
            // Same id as extractHeadings, so the table of contents can link here.
            return (
              <h2 key={index} id={headingId(plainHeading(block.text)) || undefined}>
                {renderInline(block.text)}
              </h2>
            );
          }
          return <h3 key={index}>{renderInline(block.text)}</h3>;
        }

        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return (
            <List key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </List>
          );
        }

        if (block.type === "quote") {
          return <blockquote key={index}>{renderInline(block.text)}</blockquote>;
        }

        if (block.type === "table") {
          return (
            <div key={index} className="my-8 overflow-x-auto rounded-2xl border border-line">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-slate-950 dark:bg-white/[0.06] dark:text-white">
                  <tr>
                    {block.headers.map((header, headerIndex) => (
                      <th key={`${header}-${headerIndex}`} className="border-b border-line px-4 py-3 font-bold">
                        {renderInline(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="align-top">
                      {block.headers.map((_, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3 text-slate-600 dark:text-gray-300">
                          {renderInline(row[cellIndex] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={index} className="my-8">
              <img src={block.src} alt={block.alt} loading="lazy" className="rounded-2xl border border-line" />
              {block.alt ? (
                <figcaption className="mt-2 text-center text-sm text-gray-500">{block.alt}</figcaption>
              ) : null}
            </figure>
          );
        }

        if (block.type === "quiz") {
          return block.questions.map((question, questionIndex) => (
            <ArticleQuiz
              key={`${index}-${questionIndex}`}
              question={question.question}
              options={question.options}
              answer={question.options[question.answer]}
            />
          ));
        }

        if (block.type === "notice") {
          return (
            <p key={index} className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              {block.text}
            </p>
          );
        }

        if (block.type === "code") {
          return (
            <CodeBlock key={index}>
              <code>{block.code}</code>
            </CodeBlock>
          );
        }

        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </>
  );
}

function parseMarkdown(content: string): ParsedBlock[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ParsedBlock[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let orderedList = false;
  let tableRows: string[][] = [];
  let codeLines: string[] = [];
  let codeLanguage = "";
  let inCode = false;

  // A ```quiz fence holds questions in the admin quiz text format.
  function pushCode() {
    if (codeLanguage !== "quiz") {
      blocks.push({ type: "code", code: codeLines.join("\n") });
      return;
    }

    try {
      blocks.push({ type: "quiz", questions: parseQuizText(codeLines.join("\n")) });
    } catch (error) {
      blocks.push({
        type: "notice",
        text: `Quiz block error: ${error instanceof Error ? error.message : "invalid quiz"}`,
      });
    }
  }

  function flushParagraph() {
    const text = paragraph.join(" ").replace(/\s+/g, " ").trim();
    paragraph = [];

    if (!text) {
      return;
    }

    const pastedList = parseSingleLineList(text);
    if (pastedList) {
      blocks.push(pastedList);
      return;
    }

    blocks.push({ type: "paragraph", text });
  }

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({ type: "list", ordered: orderedList, items: listItems });
      listItems = [];
    }
  }

  function flushTable() {
    if (tableRows.length > 0) {
      const [headers, ...rows] = tableRows;
      blocks.push({ type: "table", headers, rows });
      tableRows = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("```")) {
      if (inCode) {
        pushCode();
        codeLines = [];
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        flushTable();
        codeLanguage = line.slice(3).trim().toLowerCase();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    if (!line) {
      flushParagraph();
      flushList();
      flushTable();
      continue;
    }

    if (isMarkdownTableLine(line)) {
      flushParagraph();
      flushList();
      if (!isMarkdownTableSeparator(line)) {
        tableRows.push(splitTableRow(line));
      }
      continue;
    }

    const image = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(line);
    if (image) {
      flushParagraph();
      flushList();
      flushTable();
      const src = safeUrl(image[2]);
      if (src) blocks.push({ type: "image", alt: image[1].trim(), src });
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      flushTable();
      blocks.push({
        type: "heading",
        level: heading[1].length >= 3 ? 3 : 2,
        text: heading[2].trim(),
      });
      continue;
    }

    const quote = /^>\s+(.+)$/.exec(line);
    if (quote) {
      flushParagraph();
      flushList();
      flushTable();
      blocks.push({ type: "quote", text: quote[1].trim() });
      continue;
    }

    const unordered = /^[-*]\s+(.+)$/.exec(line);
    const ordered = /^\d+[.)]\s+(.+)$/.exec(line);
    if (unordered || ordered) {
      flushParagraph();
      flushTable();
      const currentOrdered = Boolean(ordered);
      if (listItems.length > 0 && orderedList !== currentOrdered) {
        flushList();
      }
      orderedList = currentOrdered;
      listItems.push((unordered?.[1] ?? ordered?.[1] ?? "").trim());
      continue;
    }

    flushList();
    flushTable();
    paragraph.push(line);
  }

  if (inCode) {
    pushCode();
  }

  flushParagraph();
  flushList();
  flushTable();

  return blocks;
}

function isMarkdownTableLine(line: string) {
  return line.includes("|") && splitTableRow(line).length >= 2;
}

function isMarkdownTableSeparator(line: string) {
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function splitTableRow(line: string) {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseSingleLineList(text: string): ParsedBlock | null {
  if (!text.startsWith("* ") && !text.startsWith("- ")) {
    return null;
  }

  const marker = text.startsWith("* ") ? "*" : "-";
  const items = text
    .replace(new RegExp(`^\\${marker}\\s+`), "")
    .split(new RegExp(`\\s+\\${marker}\\s+`))
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 1 ? { type: "list", ordered: false, items } : null;
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${match.index}-${token}`;

    if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      const href = link ? safeUrl(link[2]) : null;
      if (link && href) {
        nodes.push(
          <a key={key} href={href} target="_blank" rel="noreferrer">
            {link[1]}
          </a>,
        );
      } else if (link) {
        nodes.push(link[1]);
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

// Allows only web, site-relative, anchor and mailto URLs, which blocks javascript: and data: links.
function safeUrl(url: string) {
  const trimmed = url.trim();
  if (/^(https?:\/\/|\/(?!\/)|#|mailto:)/i.test(trimmed)) return trimmed;
  return null;
}
