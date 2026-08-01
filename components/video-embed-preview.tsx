"use client";

import { Play } from "lucide-react";
import { useState } from "react";

export function VideoEmbedPreview({
  title,
  youtubeId,
  embedUrl,
  color,
  duration,
}: {
  title: string;
  youtubeId?: string;
  embedUrl: string | null;
  color: string;
  duration: string;
}) {
  const [active, setActive] = useState(false);
  const thumbnailUrl = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null;

  if (active && embedUrl) {
    return (
      <iframe
        src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
        title={title}
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => embedUrl && setActive(true)}
      className="group/video relative h-full w-full overflow-hidden text-left"
      aria-label={`Play ${title}`}
    >
      {thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover/video:scale-105"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-35 transition group-hover/video:opacity-45`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
      <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/55 text-white shadow-xl shadow-black/30 transition group-hover/video:scale-105">
        <Play size={22} fill="currentColor" />
      </span>
      <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2.5 py-1 text-xs font-semibold text-white">
        {duration}
      </span>
    </button>
  );
}
