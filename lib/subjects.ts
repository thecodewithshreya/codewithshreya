import type { ArticleSummary, QuizSummary, VideoSummary } from "@/lib/dynamic-content";

// The site serves two audiences. Every subject belongs to one or both tracks,
// and its hub page (/topics/<slug>) gathers that subject's articles, videos and quizzes.

export type TrackId = "gate" | "jobs";

export type Track = {
  id: TrackId;
  href: string;
  label: string;
  title: string;
  description: string;
};

export const tracks: Record<TrackId, Track> = {
  gate: {
    id: "gate",
    href: "/gate",
    label: "GATE CSE",
    title: "GATE CSE preparation",
    description:
      "Subject-wise concepts, practice quizzes and previous year papers for the GATE Computer Science exam.",
  },
  jobs: {
    id: "jobs",
    href: "/interview-prep",
    label: "Job prep",
    title: "Placement and interview preparation",
    description:
      "Core CS for technical interviews, C# and .NET skills, a code playground and roadmaps for your first developer job.",
  },
};

export type Subject = {
  slug: string;
  name: string;
  description: string;
  tracks: TrackId[];
  // Article categories (lib/data.ts and the admin category list) that belong here.
  articleCategories: string[];
  // Matched against a video's subject, or its topic when it has no subject.
  videoSubjects: string[];
  quizSlugs: string[];
};

export const subjects: Subject[] = [
  {
    slug: "data-structures-and-algorithms",
    name: "Data Structures & Algorithms",
    description: "Arrays, stacks, queues, trees, graphs, complexity analysis, searching, sorting and graph algorithms.",
    tracks: ["gate", "jobs"],
    articleCategories: ["Data Structures", "Algorithms"],
    videoSubjects: ["Data Structures", "Algorithms"],
    quizSlugs: ["data-structures-fundamentals", "graph-algorithms"],
  },
  {
    slug: "dbms",
    name: "Database Management Systems",
    description: "SQL, joins, normalization, transactions, concurrency control and indexing.",
    tracks: ["gate", "jobs"],
    articleCategories: ["DBMS"],
    videoSubjects: ["DBMS"],
    quizSlugs: ["dbms-essentials"],
  },
  {
    slug: "operating-systems",
    name: "Operating Systems",
    description: "Processes, threads, CPU scheduling, synchronization, deadlocks, memory management and file systems.",
    tracks: ["gate", "jobs"],
    articleCategories: ["Operating Systems"],
    videoSubjects: ["Operating Systems"],
    quizSlugs: ["operating-systems-basics"],
  },
  {
    slug: "computer-networks",
    name: "Computer Networks",
    description: "OSI and TCP/IP layers, IP addressing and subnetting, routing, TCP, UDP, DNS and HTTP.",
    tracks: ["gate", "jobs"],
    articleCategories: ["Computer Networks"],
    videoSubjects: ["Computer Networks"],
    quizSlugs: ["computer-networks-basics"],
  },
  {
    slug: "computer-organization-and-architecture",
    name: "Computer Organization & Architecture",
    description: "Instruction formats, addressing modes, pipelining, cache and main memory, and I/O.",
    tracks: ["gate"],
    articleCategories: [],
    videoSubjects: ["COA"],
    quizSlugs: [],
  },
  {
    slug: "digital-logic",
    name: "Digital Logic",
    description: "Boolean algebra, logic gates, combinational and sequential circuits, and number systems.",
    tracks: ["gate"],
    articleCategories: [],
    videoSubjects: ["Digital Logic"],
    quizSlugs: [],
  },
  {
    slug: "theory-of-computation",
    name: "Theory of Computation",
    description: "Regular languages, finite automata, context-free grammars, pushdown automata and Turing machines.",
    tracks: ["gate"],
    articleCategories: [],
    videoSubjects: ["Theory of Computation"],
    quizSlugs: [],
  },
  {
    slug: "csharp-and-dotnet",
    name: "C# & .NET",
    description: "C# fundamentals, ASP.NET Core APIs, debugging deployments and localization for real .NET jobs.",
    tracks: ["jobs"],
    articleCategories: ["DotNet"],
    videoSubjects: [],
    quizSlugs: ["csharp-interview-basics"],
  },
  {
    slug: "system-design",
    name: "System Design",
    description: "Scalable architecture, caching, load balancing and design trade-offs for interviews.",
    tracks: ["jobs"],
    articleCategories: ["System Design"],
    videoSubjects: ["System Design"],
    quizSlugs: [],
  },
  {
    slug: "career-and-roadmaps",
    name: "Career & Roadmaps",
    description: "Learning roadmaps, programming practice and advice for landing your first developer role.",
    tracks: ["jobs"],
    articleCategories: ["Programming", "Career"],
    videoSubjects: ["Programming"],
    quizSlugs: [],
  },
];

export function getSubject(slug: string) {
  return subjects.find((subject) => subject.slug === slug);
}

export function subjectsForTrack(track: TrackId) {
  return subjects.filter((subject) => subject.tracks.includes(track));
}

export function subjectHref(subject: Subject) {
  return `/topics/${subject.slug}`;
}

export type SubjectContent = {
  articles: ArticleSummary[];
  videos: VideoSummary[];
  quizzes: QuizSummary[];
};

// Published articles, videos and quizzes for one subject, from the merged content lists.
export function contentForSubject(subject: Subject, all: SubjectContent): SubjectContent {
  return {
    articles: all.articles.filter(
      (article) => article.slug && subject.articleCategories.includes(article.category),
    ),
    videos: all.videos.filter((video) => subject.videoSubjects.includes(video.subject ?? video.topic)),
    quizzes: all.quizzes.filter((quiz) => quiz.slug && subject.quizSlugs.includes(quiz.slug)),
  };
}
