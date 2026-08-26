import type { Metadata } from "next";
import { FileText, GraduationCap, Trophy } from "lucide-react";
import { PyqPaperList } from "@/components/pyq-paper-list";
import { PyqDownloadAll } from "@/components/pyq-download-all";
import { getAllPyqPapers } from "@/lib/dynamic-content";

export const metadata: Metadata = {
  title: "Previous Year Questions",
  description: "GATE and college-wise computer science previous year questions.",
};

const gateCseBulkDownloadUrl =
  "https://drive.google.com/drive/folders/1lWK0cReQZRDslpG8VDN_piFkabwqMWCE?usp=sharing";

const pyqSets = [
  ["GATE CSE 2024 - Set 1", "GATE CSE", "Question paper", "2024", "1Y9lNJVWiB7tFnKY3U9zn07yTgbHlrEjB"],
  ["GATE CSE 2024 - Set 2", "GATE CSE", "Question paper", "2024", "1Cu_QP1OXEIhRwEXKdw9YkxB9RDnHZ9b3"],
  ["GATE CSE 2023", "GATE CSE", "Question paper", "2023", "1md9peyYihkt_DH48eFgtWv4G5ERmzj3g"],
  ["GATE CSE 2022", "GATE CSE", "Question paper", "2022", "15V5Xzj4LHP4OXBgX0EyI-Pyv5aHWzzbs"],
  ["GATE CSE 2021 - Set 1", "GATE CSE", "Question paper", "2021", "1rYaJXd4JGr4P87I5o7Im2zJZqBtJUpAy"],
  ["GATE CSE 2021 - Set 2", "GATE CSE", "Question paper", "2021", "1aWy4lliNX1_iFX5GJQlLO7HgraZ745_v"],
  ["GATE CSE 2020", "GATE CSE", "Question paper", "2020", "15RqlpHF2qTZIeFRO8a7LX8m8NANZ0oPJ"],
  ["GATE CSE 2019", "GATE CSE", "Question paper", "2019", "1JvkSFEEr4FF3nrRKyUw_KBylaeSIgRuT"],
  ["GATE CSE 2018", "GATE CSE", "Question paper", "2018", "1USajqlvqWpF7LUnPUVKqJid3F2vrG5TJ"],
  ["GATE CSE 2017 - Set 1", "GATE CSE", "Question paper", "2017", "15i_Itrpw1Ow4FQmmr64KHPmYQOnQXhcQ"],
  ["GATE CSE 2017 - Set 2", "GATE CSE", "Question paper", "2017", "1mV2UPoBzjOV6RCKmb7_wzExfJyHpIScA"],
  ["GATE CSE 2016", "GATE CSE", "Question paper", "2016", "1NZReEcpf8aGq5NJMS_DjCGYFaft9ZmbI"],
  ["GATE CSE 2015", "GATE CSE", "Question paper", "2015", "1vTKdgbgtefLzRhd9Zr0LLZvpZ0fkwxHi"],
  ["GATE CSE 2014", "GATE CSE", "Question paper", "2014", "1S2Z_5Iyh0EcP7QlWMbnMBCK0L63Chpyg"],
  ["GATE CSE 2013", "GATE CSE", "Question paper", "2013", "1opY3497oUmMAxhuBrIOpWDaf16zcI1Ul"],
  ["GATE CSE 2012", "GATE CSE", "Question paper", "2012", "1m4wyFZHPd7sO4S2apQsF3ePwajlempED"],
  ["GATE CSE 2011", "GATE CSE", "Question paper", "2011", "145IhI6r5I70mbGr9TzVGJnl3y86IKl_0"],
  ["GATE CSE 2010", "GATE CSE", "Question paper", "2010", "1_p-PPh7k6V4Ehs3lIPZ2_CpyfRIWwlCJ"],
  ["GATE CSE 2009", "GATE CSE", "Question paper", "2009", "1KyI09WEoOKJpb2xXmNoxV75ObRtYML5q"],
  ["GATE CSE 2008", "GATE CSE", "Question paper", "2008", "1RwHMz_KANK0hUL7Ddh9tHdyDDWFlUpuu"],
  ["GATE CSE 2007", "GATE CSE", "Question paper", "2007", "1IG5m19UIaYi7dBm-AEFe70Vgo85YGEFK"],
] as const;

const filters = [
  ["GATE CSE", "21 PYQs"],
  ["BARC PYQ", "Coming soon"],
  ["Other CSE PYQ", "Coming soon"],
];

const pyqPapers = pyqSets.map(([title, source, questions, year, fileId]) => ({
  title,
  source,
  questions,
  year,
  fileId,
}));

export const dynamic = "force-dynamic";

export default async function PyqPage() {
  const papers = await getAllPyqPapers(pyqPapers);

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
