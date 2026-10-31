import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, GraduationCap, Trophy } from "lucide-react";
import { PyqPaperList } from "@/components/pyq-paper-list";
import { PyqDownloadAll } from "@/components/pyq-download-all";
import { getAllPyqPapers } from "@/lib/dynamic-content";
import { staticPyqPapers } from "@/lib/pyq";

export const metadata: Metadata = {
  title: "GATE CSE Previous Year Papers",
  description: "GATE CSE previous year question papers from 2007 onwards, year by year, to view or download.",
  alternates: { canonical: "/pyq" },
};

const gateCseBulkDownloadUrl =
  "https://drive.google.com/drive/folders/1lWK0cReQZRDslpG8VDN_piFkabwqMWCE?usp=sharing";

export const dynamic = "force-dynamic";

export default async function PyqPage({ searchParams }: { searchParams: Promise<{ year?: string | string[] }> }) {
  const [papers, { year }] = await Promise.all([getAllPyqPapers(staticPyqPapers), searchParams]);

  return (
    <>
      <section className="container-page py-10">
        <CompactHeader
          label="Previous year questions"
          title="Practice real exam questions"
        />
        <div className="mb-8 flex flex-wrap gap-3">
          <span className="rounded-lg border border-violet-200 bg-violet-100 px-4 py-2 text-sm text-[#5f33d7] dark:border-violet-500/35 dark:bg-violet-500/15 dark:text-violet-200">
            GATE CSE - {papers.length} papers
          </span>
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
        <div id="papers" className="scroll-mt-24">
          <PyqPaperList papers={papers} initialYear={typeof year === "string" ? year : undefined} />
        </div>
      </section>

      <section className="container-page py-16">
        <div className="card overflow-hidden border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 via-panel to-purple-500/10 p-8 sm:p-12">
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
            <span className="grid h-16 w-16 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300">
              <Trophy size={30} />
            </span>
            <div>
              <p className="eyebrow">Topic-wise practice</p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Weak in a subject? Practise it first
              </h2>
              <p className="mt-2 text-gray-400">
                Take the subject quizzes with explanations, then come back to the full papers.
              </p>
            </div>
            <Link href="/gate" className="button-secondary">
              GATE preparation <ArrowRight size={16} />
            </Link>
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
