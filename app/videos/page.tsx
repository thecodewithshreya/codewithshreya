import type { Metadata } from "next";
import { VideoFilterList } from "@/components/video-filter-list";
import { getAllVideos } from "@/lib/dynamic-content";

export const metadata: Metadata = {
  title: "Videos",
  description: "Focused computer science video lessons.",
};

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const videos = await getAllVideos();

  return (
    <>
      <section className="container-page py-10">
        <div className="mb-8">
          <p className="eyebrow">Video library</p>
          <h1 className="mt-2 text-3xl font-black text-white">Visual lessons</h1>
        </div>
        <VideoFilterList videos={videos} />
      </section>
    </>
  );
}
