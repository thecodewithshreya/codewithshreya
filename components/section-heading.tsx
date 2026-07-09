import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 leading-7 text-gray-400">{description}</p>
      )}
    </div>
  );
}
