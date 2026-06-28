import type { MDXComponents } from "mdx/types";
import { ArticleQuiz } from "@/components/mdx/article-quiz";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ArticleQuiz,
    ...components,
  };
}
