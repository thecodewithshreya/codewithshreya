import type { Metadata } from "next";
import { ToolsWorkspace } from "@/components/tools-workspace";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Working developer and computer science tools for formatting, conversion, regex, base arithmetic, and code diff.",
};

export default function ToolsPage() {
  return (
      <section className="container-page py-10">
        <div className="mb-8">
          <p className="eyebrow">Tools</p>
          <h1 className="mt-2 text-3xl font-black text-white">Developer tools</h1>
        </div>
        <ToolsWorkspace />
      </section>
  );
}
