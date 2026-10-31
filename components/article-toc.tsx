import { ListTree } from "lucide-react";
import type { ArticleHeading } from "@/lib/headings";

// Native <details>, so it works without JavaScript and stays out of the way when closed.
export function ArticleToc({ headings }: { headings: ArticleHeading[] }) {
  if (headings.length < 3) {
    return null;
  }

  return (
    <nav aria-label="On this page" className="mt-8">
      <details className="group card px-5 py-4">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          <ListTree size={16} className="text-violet-300" />
          On this page
          <span className="font-normal text-gray-500">({headings.length} sections)</span>
          <span className="ml-auto text-gray-500 transition group-open:rotate-90" aria-hidden="true">
            ›
          </span>
        </summary>
        <ol className="mt-4 space-y-2 border-l border-line pl-4 text-sm">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a href={`#${heading.id}`} className="text-gray-400 transition hover:text-violet-300">
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
