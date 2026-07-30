import type { Metadata } from "next";
import { CompilerPlayground } from "@/components/compiler-playground";

export const metadata: Metadata = {
  title: "Online Compiler",
  description: "Practice programming with the CodeWithShreya compiler interface.",
};

export default function CompilerPage() {
  return (
    <section className="container-page py-8 sm:py-10">
      <CompilerPlayground />
    </section>
  );
}
