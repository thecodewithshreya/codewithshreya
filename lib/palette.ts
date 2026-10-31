import { subjects, type Subject } from "@/lib/subjects";

// One colour per meaning (see CLAUDE.md, Theming): violet = brand and GATE,
// cyan = job prep, a violet-to-cyan blend = core CS that serves both. Cards
// take their colour from their subject instead of a stored, arbitrary gradient.

export type Tone = "gate" | "jobs" | "both" | "neutral";

function toneOf(subject: Subject | undefined): Tone {
  if (!subject) return "neutral";
  if (subject.tracks.length > 1) return "both";
  return subject.tracks[0];
}

export function articleTone(category: string): Tone {
  return toneOf(subjects.find((subject) => subject.articleCategories.includes(category)));
}

export function videoTone(video: { subject?: string; topic: string }): Tone {
  const key = video.subject ?? video.topic;
  return toneOf(subjects.find((subject) => subject.videoSubjects.includes(key)));
}

export function quizTone(slug: string | undefined): Tone {
  return toneOf(slug ? subjects.find((subject) => subject.quizSlugs.includes(slug)) : undefined);
}

// Soft header band on article cards.
export const cardBand: Record<Tone, string> = {
  gate: "from-violet-500/30 to-indigo-500/5",
  jobs: "from-cyan-500/30 to-sky-500/5",
  both: "from-violet-500/30 via-indigo-500/10 to-cyan-500/15",
  neutral: "from-slate-500/25 to-slate-500/5",
};

// Solid poster behind video thumbnails (also shown while the thumbnail loads).
export const videoPoster: Record<Tone, string> = {
  gate: "from-violet-600 to-indigo-950",
  jobs: "from-cyan-600 to-slate-950",
  both: "from-violet-600 to-cyan-900",
  neutral: "from-slate-600 to-slate-950",
};

// Icon tiles, e.g. on quiz cards.
export const iconTile: Record<Tone, string> = {
  gate: "bg-violet-500/15 text-violet-300",
  jobs: "bg-cyan-500/15 text-cyan-300",
  both: "bg-violet-500/15 text-violet-300",
  neutral: "bg-slate-500/15 text-gray-300",
};

// Difficulty is not a right/wrong signal, so it gets dots rather than green/amber/red.
export function levelDots(level: string | undefined) {
  if (level === "Advanced") return 3;
  if (level === "Intermediate") return 2;
  return 1;
}
