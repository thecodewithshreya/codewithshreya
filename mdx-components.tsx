import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/code-block";
import { ArticleQuiz } from "@/components/mdx/article-quiz";
import { headingId, nodeText } from "@/lib/headings";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ArticleQuiz,
    pre: CodeBlock,
    // Ids match extractHeadings, so the article table of contents can link to them.
    h2: ({ children, ...props }) => (
      <h2 id={headingId(nodeText(children)) || undefined} {...props}>
        {children}
      </h2>
    ),
    ...components,
  };
}
