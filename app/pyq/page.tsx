import type { Metadata } from "next";
import { FileText, GraduationCap, Trophy } from "lucide-react";
import { PyqPaperList } from "@/components/pyq-paper-list";
import { PyqDownloadAll } from "@/components/pyq-download-all";
import { getAllPyqPapers } from "@/lib/dynamic-content";
import { staticPyqPapers } from "@/lib/pyq";

export const metadata: Metadata = {
  title: "Previous Year Questions",
  description: "GATE and college-wise computer science previous year questions.",
};

const gateCseBulkDownloadUrl =
  "https://drive.google.com/drive/folders/1lWK0cReQZRDslpG8VDN_piFkabwqMWCE?usp=sharing";

const filters = [
  ["GATE CSE", "21 PYQs"],
  ["BARC PYQ", "Coming soon"],
  ["Other CSE PYQ", "Coming soon"],
];

export const dynamic = "force-dynamic";

export default async function PyqPage() {
  const papers = await getAllPyqPapers(staticPyqPapers);

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
                  ? "border border-violet-200 bg-violet-100 text-[#5f33d7] dark:border-violet-500/35 dark:bg-violet-500/15 dark:text-violet-200"
                  : "border border-line bg-white/70 text-slate-500 dark:bg-[#111827] dark:text-gray-300"
              }`}
            >
              {name} - {count}
            </span>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionTitle
            icon={GraduationCap}
            label="Subject papers"
            title="GATE CSE previous year papers"
          />
          <PyqDownloadAll
            bulkDownloadUrl={gateCseBulkDownloadUrl}
          />
        </div>
        <PyqPaperList papers={papers} />
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
      <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-slate-50">{title}</h1>
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
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white text-[#5f33d7] dark:bg-[#111827] dark:text-indigo-300">
        <Icon size={22} />
      </span>
      <div>
        <p className="eyebrow">{label}</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-slate-50">{title}</h2>
      </div>
    </div>
  );
}
