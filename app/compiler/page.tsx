import type { Metadata } from "next";
import { CompilerPlayground } from "@/components/compiler-playground";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Online Compiler",
  description: "Practice programming with the CodeWithShreya compiler interface.",
};

export default function CompilerPage() {
  return (
    <>
      <PageHero
        eyebrow="Online compiler"
        title="Write, test, and learn"
        description="Choose a language and experiment in a clean coding workspace. This preview uses sample output and does not execute code."
      />
      <section className="container-page py-12 sm:py-16">
        <CompilerPlayground />
      </section>
    </>
  );
}
