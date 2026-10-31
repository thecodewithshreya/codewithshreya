import { splitTitle } from "@/lib/title";

export function TitleText({ title }: { title: string }) {
  return splitTitle(title).map((part, index) =>
    part.code ? (
      <code key={index} className="title-code">
        {part.text}
      </code>
    ) : (
      part.text
    ),
  );
}
