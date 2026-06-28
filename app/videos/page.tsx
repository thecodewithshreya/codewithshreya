import type { Metadata } from "next";
import { VideoCard } from "@/components/content-cards";
import { PageHero } from "@/components/page-hero";
import { videos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Videos",
  description: "Focused computer science video lessons.",
};

export default function VideosPage() {
  return (
    <>
      <PageHero
        eyebrow="Video library"
        title="Learn visually, understand deeply"
        description="Focused lessons and concept walkthroughs to help you learn faster and retain more."
      />
      <section className="container-page py-16">
        <div className="mb-8 flex flex-wrap gap-2">
          {["All videos", "DSA", "Core CS", "Programming", "GATE"].map((filter, index) => (
            <span
              key={filter}
              className={`rounded-full px-4 py-2 text-sm ${
                index === 0 ? "bg-indigo-600 text-white" : "border border-line text-gray-400"
              }`}
            >
              {filter}
            </span>
          ))}
          <span className="self-center px-2 text-xs text-gray-500">Filters coming soon</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => <VideoCard key={video.title} video={video} />)}
        </div>
      </section>
    </>
  );
}
