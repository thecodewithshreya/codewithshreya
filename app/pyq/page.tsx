import type { Metadata } from "next";
import { Building2, CalendarDays, FileText, GraduationCap, Trophy } from "lucide-react";
import { PyqCard } from "@/components/content-cards";

export const metadata: Metadata = {
  title: "Previous Year Questions",
  description: "GATE and college-wise computer science previous year questions.",
};

const pyqSets = [
  ["Data Structures", "VTU", "42 solved questions", "2023"],
  ["Algorithms", "VTU", "38 solved questions", "2023"],
  ["Operating Systems", "VTU", "29 solved questions", "2022"],
  ["Database Management", "VTU", "35 solved questions", "2022"],
  ["Computer Networks", "VTU", "31 solved questions", "2021"],
  ["Web Development", "VTU", "24 solved questions", "2023"],
];

const filters = [
  ["GATE CSE", "65 questions"],
  ["VTU", "199 questions"],
  ["AKTU", "Coming soon"],
  ["DU", "Coming soon"],
];

export default function PyqPage() {
  return (
    <>
      <section className="container-page py-10">
        <CompactHeader
          label="Previous year questions"
          title="Practice real exam questions"
        />
        <div className="mb-8 flex flex-wrap gap-3">
          {filters.map(([name, count], index) => (
            <span
              key={name}
              className={`rounded-lg px-4 py-2 text-sm ${
                index === 0
                  ? "bg-indigo-500 text-white"
                  : "border border-line bg-white/[0.025] text-gray-400"
              }`}
            >
              {name} - {count}
            </span>
          ))}
        </div>

        <SectionTitle
          icon={GraduationCap}
          label="Subject papers"
          title="College-wise solved PYQs"
        />
        <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pyqSets.map(([title, source, questions, year]) => (
            <PyqCard
              key={title}
              title={title}
              source={source}
              questions={questions}
              year={year}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white/[0.015]">
        <div className="container-page py-16">
          <SectionTitle
            icon={Building2}
            label="Page idea"
            title="How this PYQ section should grow"
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Year filter", "Sort by 2021, 2022, 2023, 2024"],
              ["Subject filter", "DSA, DBMS, OS, CN, Web"],
              ["Solved mode", "Question, answer, and explanation"],
              ["Download", "PDF export for offline revision"],
            ].map(([name, text]) => (
              <div key={name} className="card p-5">
                <CalendarDays size={21} className="text-indigo-300" />
                <h3 className="mt-4 font-semibold text-white">{name}</h3>
                <p className="mt-1 text-sm text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="card overflow-hidden border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 via-panel to-purple-500/10 p-8 sm:p-12">
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
            <span className="grid h-16 w-16 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300">
              <Trophy size={30} />
            </span>
            <div>
              <p className="eyebrow">PYQ quiz mode</p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Simulate the exam experience
              </h2>
              <p className="mt-2 text-gray-400">
                Attempt timed questions, review explanations, and track your score.
              </p>
            </div>
            <span className="button-secondary">Coming soon</span>
          </div>
        </div>
      </section>
    </>
  );
}

function CompactHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="eyebrow">{label}</p>
      <h1 className="mt-2 text-3xl font-black text-white">{title}</h1>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  label,
  title,
}: {
  icon: typeof FileText;
  label: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-panel text-indigo-300">
        <Icon size={22} />
      </span>
      <div>
        <p className="eyebrow">{label}</p>
        <h2 className="mt-1 text-2xl font-bold text-white">{title}</h2>
      </div>
    </div>
  );
}
