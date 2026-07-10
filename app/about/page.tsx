import type { Metadata } from "next";
import { BookOpen, Code2, Heart, Lightbulb, Target, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the mission behind CodeWithShreya.",
};

const values = [
  { icon: Lightbulb, title: "Clarity first", text: "Complex concepts should be explained with simple mental models and practical examples." },
  { icon: Code2, title: "Learn by doing", text: "Real understanding comes from applying concepts through code, questions, and projects." },
  { icon: Heart, title: "Accessible learning", text: "High-quality computer science education should be approachable and available to everyone." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About CodeWithShreya"
        title="Computer science, taught with clarity"
        description="A learning platform built to help students move from memorizing definitions to truly understanding how technology works."
      />
      <section className="container-page py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Our mission</p>
            <h2 className="mt-3 text-3xl font-bold">Make every concept click</h2>
            <p className="mt-5 leading-7 text-gray-400">
              CodeWithShreya brings together focused explanations, visual lessons,
              hands-on coding, quizzes, and exam preparation in one coherent
              learning experience.
            </p>
            <p className="mt-4 leading-7 text-gray-400">
              Whether you are beginning your CS degree, preparing for an exam, or
              strengthening your interview fundamentals, the goal stays the same:
              help you learn with confidence and direction.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              [BookOpen, "100+", "Lessons"],
              [Users, "10K+", "Learners"],
              [Target, "50+", "Quizzes"],
              [Code2, "1", "Compiler"],
            ].map(([Icon, value, label]) => {
              const StatIcon = Icon as typeof BookOpen;
              return (
                <div key={String(label)} className="card p-6">
                  <StatIcon size={22} className="text-indigo-400" />
                  <div className="mt-4 text-2xl font-bold">{String(value)}</div>
                  <div className="mt-1 text-sm text-gray-500">{String(label)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="border-y border-line bg-white/[0.015]">
        <div className="container-page py-16">
          <div className="text-center">
            <p className="eyebrow">How we teach</p>
            <h2 className="mt-3 text-3xl font-bold">Learning principles that guide us</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <value.icon size={23} />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
