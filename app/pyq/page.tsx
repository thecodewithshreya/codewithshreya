import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Clock3, FileCheck2, FileText, GraduationCap, Trophy } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Previous Year Questions",
  description: "GATE and college-wise computer science previous year questions.",
};

const gatePapers = [
  ["GATE CSE 2025", "65 questions", "3 hours"],
  ["GATE CSE 2024", "65 questions", "3 hours"],
  ["GATE CSE 2023", "65 questions", "3 hours"],
];

const colleges = [
  ["Delhi University", "12 papers"],
  ["AKTU", "18 papers"],
  ["Mumbai University", "14 papers"],
  ["VTU", "16 papers"],
];

export default function PyqPage() {
  return (
    <>
      <PageHero
        eyebrow="Previous year questions"
        title="Practice the questions that matter"
        description="Prepare with curated GATE papers, university exams, and interactive PYQ quizzes."
      />
      <section className="container-page py-16">
        <SectionTitle icon={GraduationCap} label="GATE CSE" title="GATE previous year papers" />
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {gatePapers.map(([title, questions, time]) => (
            <div key={title} className="card card-hover p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <FileText size={22} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <div className="mt-3 flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><FileCheck2 size={14} /> {questions}</span>
                <span className="flex items-center gap-1.5"><Clock3 size={14} /> {time}</span>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-indigo-400">
                View paper <ArrowRight size={15} />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white/[0.015]">
        <div className="container-page py-16">
          <SectionTitle icon={Building2} label="University exams" title="College-wise PYQs" />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colleges.map(([name, count]) => (
              <div key={name} className="card card-hover p-5">
                <Building2 size={21} className="text-purple-400" />
                <h3 className="mt-4 font-semibold">{name}</h3>
                <p className="mt-1 text-sm text-gray-500">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="card overflow-hidden bg-gradient-to-br from-indigo-600/20 via-panel to-purple-500/10 p-8 sm:p-12">
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-300">
              <Trophy size={30} />
            </span>
            <div>
              <p className="eyebrow">PYQ quiz mode</p>
              <h2 className="mt-2 text-2xl font-bold">Simulate the exam experience</h2>
              <p className="mt-2 text-gray-400">Attempt timed questions, review explanations, and track your score.</p>
            </div>
            <Link href="/quizzes" className="button-primary">Start a quiz <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionTitle({
  icon: Icon,
  label,
  title,
}: {
  icon: typeof GraduationCap;
  label: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-panel text-indigo-400">
        <Icon size={22} />
      </span>
      <div>
        <p className="eyebrow">{label}</p>
        <h2 className="mt-1 text-2xl font-bold">{title}</h2>
      </div>
    </div>
  );
}
