"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { VideoCard } from "@/components/content-cards";
import { StaggerReveal } from "@/components/motion/reveal";

type Video = {
  title: string;
  topic: string;
  subject?: string;
  duration: string;
  color: string;
  level?: string;
  description?: string;
  youtubeId?: string;
  youtubePlaylistId?: string;
  youtubePlaylistIndex?: number;
  youtubeUrl?: string;
};

const filters = ["All videos", "Algorithms", "Core CS", ".NET", "System Design"] as const;
type VideoFilter = (typeof filters)[number];
const coreSubjects = ["All Core CS", "Computer Networks", "Theory of Computation", "COA", "Digital Logic", "DBMS", "Operating Systems", "Algorithms"] as const;
type CoreSubject = (typeof coreSubjects)[number];
const filterHashes: Record<VideoFilter, string> = {
  "All videos": "all-videos",
  Algorithms: "algorithms",
  "Core CS": "core-cs",
  ".NET": "dotnet",
  "System Design": "system-design",
};
const hashFilters = Object.fromEntries(
  Object.entries(filterHashes).map(([filter, hash]) => [hash, filter]),
) as Record<string, VideoFilter>;
const coreSubjectHashes: Record<Exclude<CoreSubject, "All Core CS">, string> = {
  "Computer Networks": "computer-networks",
  "Theory of Computation": "toc",
  COA: "coa",
  "Digital Logic": "digital-logic",
  DBMS: "dbms",
  "Operating Systems": "operating-systems",
  Algorithms: "algorithms",
};
const hashCoreSubjects = Object.fromEntries(
  Object.entries(coreSubjectHashes).map(([subject, hash]) => [hash, subject]),
) as Record<string, Exclude<CoreSubject, "All Core CS">>;
const videosPerPage = 6;

export function VideoFilterList({ videos }: { videos: Video[] }) {
  const [activeFilter, setActiveFilter] = useState<VideoFilter>(getFilterFromHash);
  const [activeCoreSubject, setActiveCoreSubject] = useState<CoreSubject>(getCoreSubjectFromHash);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filteredVideos = useMemo(
    () =>
      videos.filter(
        (video) =>
          videoMatchesFilter(video, activeFilter, activeCoreSubject) &&
          videoMatchesSearch(video, searchQuery),
      ),
    [activeCoreSubject, activeFilter, searchQuery, videos],
  );
  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / videosPerPage));
  const visibleVideos = filteredVideos.slice(
    (currentPage - 1) * videosPerPage,
    currentPage * videosPerPage,
  );

  useEffect(() => {
    const syncFilterFromHash = () => {
      setActiveFilter(getFilterFromHash());
      setActiveCoreSubject(getCoreSubjectFromHash());
    };
    syncFilterFromHash();
    window.addEventListener("hashchange", syncFilterFromHash);
    return () => window.removeEventListener("hashchange", syncFilterFromHash);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCoreSubject, activeFilter, searchQuery]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  function chooseFilter(filter: VideoFilter) {
    setActiveFilter(filter);
    if (filter !== "Core CS") {
      setActiveCoreSubject("All Core CS");
    }
    window.history.pushState(null, "", `#${filterHashes[filter]}`);
    scrollToVideos();
  }

  function chooseCoreSubject(subject: CoreSubject) {
    setActiveFilter("Core CS");
    setActiveCoreSubject(subject);
    const subjectHash = subject === "All Core CS" ? "" : `/${coreSubjectHashes[subject]}`;
    window.history.pushState(null, "", `#${filterHashes["Core CS"]}${subjectHash}`);
    scrollToVideos();
  }

  function choosePage(page: number) {
    setCurrentPage(page);
    scrollToVideos();
  }

  function scrollToVideos() {
    window.setTimeout(() => {
      document.getElementById("video-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" aria-label="Video categories">
        {filters.map((filter) => {
          const active = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => chooseFilter(filter)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-amber-500 text-gray-950 shadow-lg shadow-amber-950/15"
                  : "border border-line bg-white/70 text-slate-600 hover:border-amber-400/60 hover:text-slate-950 dark:bg-white/[0.025] dark:text-gray-400 dark:hover:text-white"
              }`}
              aria-pressed={active}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <section id="video-results" className="scroll-mt-28">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            {getSectionTitle(activeFilter, activeCoreSubject)}
          </h2>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            {activeFilter === "Core CS" ? (
              <div className="relative w-full sm:w-56">
                <label
                  htmlFor="core-subject-filter"
                  className="absolute -top-2 left-4 bg-[var(--page-background)] px-1 text-xs font-bold text-slate-600 dark:text-gray-400"
                >
                  Subject
                </label>
                <select
                  id="core-subject-filter"
                  value={activeCoreSubject}
                  onChange={(event) => chooseCoreSubject(event.target.value as CoreSubject)}
                  className="h-12 w-full rounded-xl border border-line bg-white/90 px-4 pr-10 text-sm font-bold text-slate-950 shadow-sm shadow-indigo-950/5 outline-none transition focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10 dark:bg-white/[0.035] dark:text-white dark:shadow-none"
                >
                  {coreSubjects.map((subject) => (
                    <option key={subject} value={subject} className="text-slate-950">
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="w-full max-w-md sm:w-[360px]">
            <label htmlFor="video-search" className="sr-only">
              Search video lessons
            </label>
            <div className="flex h-12 items-center gap-3 rounded-xl border border-line bg-white/80 px-4 shadow-sm shadow-indigo-950/5 transition focus-within:border-violet-400/70 focus-within:ring-4 focus-within:ring-violet-500/10 dark:bg-white/[0.035] dark:shadow-none">
              <Search size={18} className="shrink-0 text-slate-400 dark:text-gray-500" />
              <input
                id="video-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={`Search ${filteredVideos.length} videos...`}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-gray-500"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-900/5 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              ) : null}
            </div>
            </div>
          </div>
        </div>
        <StaggerReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleVideos.map((video) => (
            <VideoCard key={video.title} video={video} />
          ))}
        </StaggerReveal>
        {filteredVideos.length === 0 ? (
          <div className="rounded-xl border border-line bg-white/70 p-6 text-sm text-slate-500 dark:bg-white/[0.035] dark:text-gray-400">
            No videos found. Try another search or change the selected section.
          </div>
        ) : null}
        {filteredVideos.length > videosPerPage ? (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-line bg-white/70 p-3 dark:bg-white/[0.035] sm:flex-row">
            <span className="text-sm font-medium text-slate-500 dark:text-gray-400">
              Showing {(currentPage - 1) * videosPerPage + 1}-{Math.min(currentPage * videosPerPage, filteredVideos.length)} of {filteredVideos.length}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => choosePage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-slate-700 transition hover:border-violet-400 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/[0.04] dark:text-gray-300 dark:hover:text-white"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              {getPaginationPages(currentPage, totalPages).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => choosePage(page)}
                  className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold transition ${
                    currentPage === page
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-950/20"
                      : "border border-line bg-white text-slate-700 hover:border-violet-400 hover:text-violet-700 dark:bg-white/[0.04] dark:text-gray-300 dark:hover:text-white"
                  }`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => choosePage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-slate-700 transition hover:border-violet-400 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/[0.04] dark:text-gray-300 dark:hover:text-white"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}

function getPaginationPages(currentPage: number, totalPages: number) {
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function getFilterFromHash(): VideoFilter {
  if (typeof window === "undefined") return "All videos";
  const [filterHash] = window.location.hash.replace("#", "").split("/");
  return hashFilters[filterHash] ?? "All videos";
}

function getCoreSubjectFromHash(): CoreSubject {
  if (typeof window === "undefined") return "All Core CS";
  const [, subjectHash] = window.location.hash.replace("#", "").split("/");
  return hashCoreSubjects[subjectHash] ?? "All Core CS";
}

function videoMatchesFilter(video: Video, filter: VideoFilter, coreSubject: CoreSubject) {
  if (filter === "All videos") return true;
  if (filter === ".NET") {
    return video.topic === ".NET" || video.topic === "Programming" || video.title.includes(".NET");
  }
  if (filter === "Core CS") {
    const isCoreVideo = ["Core CS", "DBMS", "Operating Systems", "Computer Networks", "Algorithms", "COA", "Digital Logic"].includes(video.topic);
    if (!isCoreVideo) return false;
    return coreSubject === "All Core CS" || getCoreSubject(video) === coreSubject;
  }
  return video.topic === filter;
}

function videoMatchesSearch(video: Video, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return [
    video.title,
    video.topic,
    video.subject,
    video.level,
    video.duration,
    video.description,
  ]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes(normalizedQuery));
}

function getCoreSubject(video: Video): Exclude<CoreSubject, "All Core CS"> | null {
  if (video.subject) return video.subject as Exclude<CoreSubject, "All Core CS">;
  if (video.topic === "DBMS") return "DBMS";
  if (video.topic === "Algorithms") return "Algorithms";
  if (video.topic === "COA" || video.title.includes("Computer Organization")) return "COA";
  if (video.topic === "Digital Logic" || video.title.includes("Digital Logic")) return "Digital Logic";
  if (video.topic === "Operating Systems" || video.title.includes("Operating Systems")) return "Operating Systems";
  if (video.topic === "Computer Networks" || video.title.includes("Computer Networks")) return "Computer Networks";
  if (video.title.includes("Theory of Computation")) return "Theory of Computation";
  return null;
}

function getSectionTitle(filter: VideoFilter, coreSubject: CoreSubject) {
  if (filter === "All videos") return "All video lessons";
  if (filter === "Core CS") {
    return coreSubject === "All Core CS" ? "Core CS lessons" : `${coreSubject} lessons`;
  }
  return `${filter} lessons`;
}
