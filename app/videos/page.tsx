import type { Metadata } from "next";
import { VideoCard } from "@/components/content-cards";
import { T } from "@/components/i18n-provider";
import { PageHero } from "@/components/page-hero";
import { StaggerReveal } from "@/components/motion/reveal";
import { videos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Videos",
  description: "Focused computer science video lessons.",
};

export default function VideosPage() {
  return (
    <>
      <PageHero
        eyebrow={<T k="videos.eyebrow" />}
        title={<T k="videos.title" />}
        description={<T k="videos.description" />}
      />
      <section className="container-page py-16">
        <div className="mb-8 flex flex-wrap gap-2">
          {["videos.filter.all", "DSA", "Core CS", "Programming", "GATE"].map((filter, index) => (
            <span
              key={filter}
              className={`rounded-full px-4 py-2 text-sm ${
                index === 0 ? "bg-indigo-600 text-white" : "border border-line text-gray-400"
              }`}
            >
              {filter.includes(".") ? <T k={filter} /> : filter}
            </span>
          ))}
          <span className="self-center px-2 text-xs text-gray-500"><T k="common.filtersComingSoon" /></span>
        </div>
        <StaggerReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => <VideoCard key={video.title} video={video} />)}
        </StaggerReveal>
      </section>
    </>
  );
}
