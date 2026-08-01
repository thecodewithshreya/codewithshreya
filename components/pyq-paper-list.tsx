"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PyqCard } from "@/components/content-cards";

type PyqPaper = {
  title: string;
  source: string;
  questions: string;
  year: string;
  fileId: string;
};

export function PyqPaperList({ papers }: { papers: PyqPaper[] }) {
  const [selectedYear, setSelectedYear] = useState("all");
  const [yearOpen, setYearOpen] = useState(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const years = useMemo(
    () =>
      Array.from(new Set(papers.map((paper) => paper.year))).sort(
        (first, second) => Number(second) - Number(first),
      ),
    [papers],
  );
  const filteredPapers =
    selectedYear === "all"
      ? papers
      : papers.filter((paper) => paper.year === selectedYear);
  const yearOptions = useMemo(() => ["all", ...years], [years]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!yearDropdownRef.current?.contains(event.target as Node)) {
        setYearOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setYearOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="mt-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div
          ref={yearDropdownRef}
          className="relative inline-flex w-36 rounded-md border border-slate-300 bg-white px-4 pb-2 pt-3 shadow-sm dark:border-line dark:!bg-[#111827]"
        >
          <span className="absolute -top-2 left-3 bg-[#f7f8fc] px-1.5 text-[11px] font-semibold text-slate-600 dark:bg-[#070a12] dark:text-gray-300">
            Year
          </span>
          <button
            type="button"
            onClick={() => setYearOpen((value) => !value)}
            className="flex w-full items-center justify-between gap-3 text-left text-lg font-bold text-slate-950 outline-none dark:text-white"
            aria-expanded={yearOpen}
            aria-haspopup="listbox"
            aria-label="Filter PYQ papers by year"
          >
            {selectedYear === "all" ? "All" : selectedYear}
            <ChevronDown
              size={18}
              strokeWidth={2.4}
              className={`shrink-0 text-slate-700 transition dark:text-gray-300 ${
                yearOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`absolute left-0 top-[calc(100%+4px)] z-30 max-h-64 w-full overflow-y-auto rounded-sm border border-slate-300 bg-white py-1 shadow-xl transition dark:border-line dark:!bg-[#111827] ${
              yearOpen
                ? "visible opacity-100"
                : "invisible pointer-events-none opacity-0"
            }`}
            role="listbox"
            aria-label="Year options"
            aria-hidden={!yearOpen}
          >
            {yearOptions.map((year) => {
              const active = selectedYear === year;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => {
                    setSelectedYear(year);
                    setYearOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-base transition ${
                    active
                      ? "bg-slate-600 text-white dark:bg-violet-600"
                      : "text-slate-950 hover:bg-slate-100 dark:text-white dark:hover:bg-white/[0.07]"
                  }`}
                  role="option"
                  aria-selected={active}
                  tabIndex={yearOpen ? 0 : -1}
                >
                  {year === "all" ? "All" : year}
                </button>
              );
            })}
          </div>
        </div>
        <p className="pb-2 text-sm text-slate-500 dark:text-gray-400">
          Showing {filteredPapers.length} of {papers.length} PYQs
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPapers.map((paper) => (
          <PyqCard
            key={paper.title}
            title={paper.title}
            source={paper.source}
            questions={paper.questions}
            year={paper.year}
            viewUrl={`https://drive.google.com/file/d/${paper.fileId}/view?usp=sharing`}
            previewUrl={`https://drive.google.com/file/d/${paper.fileId}/preview`}
            downloadUrl={`https://drive.google.com/uc?export=download&id=${paper.fileId}`}
          />
        ))}
      </div>
    </div>
  );
}
