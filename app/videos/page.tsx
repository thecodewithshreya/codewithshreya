import type { Metadata } from "next";
import { VideoCard } from "@/components/content-cards";
import { StaggerReveal } from "@/components/motion/reveal";
import { videos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Videos",
  description: "Focused computer science video lessons.",
};

export default function VideosPage() {
  return (
    <>
      <section className="container-page py-10">
        <div className="mb-8">
          <p className="eyebrow">Video library</p>
          <h1 className="mt-2 text-3xl font-black text-white">Visual lessons</h1>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {["All videos", "Algorithms", "Core CS", ".NET", "System Design"].map((filter, index) => (
            <span
              key={filter}
              className={`rounded-lg px-4 py-2 text-sm ${
                index === 0
                  ? "bg-amber-500 text-gray-950"
                  : "border border-line bg-white/[0.025] text-gray-400"
              }`}
            >
              {filter}
            </span>
          ))}
        </div>
        <StaggerReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => <VideoCard key={video.title} video={video} />)}
        </StaggerReveal>
      </section>
    </>
  );
}
