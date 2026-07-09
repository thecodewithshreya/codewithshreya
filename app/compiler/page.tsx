import type { Metadata } from "next";
import { CompilerPlayground } from "@/components/compiler-playground";
import { T } from "@/components/i18n-provider";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Online Compiler",
  description: "Practice programming with the CodeWithShreya compiler interface.",
};

export default function CompilerPage() {
  return (
    <>
      <PageHero
        eyebrow={<T k="compiler.eyebrow" />}
        title={<T k="compiler.title" />}
        description={<T k="compiler.description" />}
      />
      <section className="container-page py-12 sm:py-16">
        <CompilerPlayground />
      </section>
    </>
  );
}
