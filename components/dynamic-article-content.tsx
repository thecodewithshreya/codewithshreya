type DynamicArticleContentProps = {
  content: string;
};

export function DynamicArticleContent({ content }: DynamicArticleContentProps) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={index}>
              {block.replace(/^##\s+/, "")}
            </h2>
          );
        }

        if (block.startsWith("# ")) {
          return (
            <h2 key={index}>
              {block.replace(/^#\s+/, "")}
            </h2>
          );
        }

        if (block.startsWith("- ")) {
          return (
            <ul key={index}>
              {block.split("\n").map((item) => (
                <li key={item}>{item.replace(/^-\s+/, "")}</li>
              ))}
            </ul>
          );
        }

        if (block.startsWith("```")) {
          return (
            <pre key={index}>
              <code>
                {block
                  .replace(/^```[a-z]*\n?/i, "")
                  .replace(/\n?```$/, "")}
              </code>
            </pre>
          );
        }

        return <p key={index}>{block}</p>;
      })}
    </>
  );
}
