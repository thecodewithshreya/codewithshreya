import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, FileQuestion, GraduationCap, PlayCircle, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const destinations = [
  { href: "/blog", label: "Articles", icon: BookOpenText },
  { href: "/quizzes", label: "Quizzes", icon: FileQuestion },
  { href: "/videos", label: "Videos", icon: PlayCircle },
  { href: "/pyq", label: "Previous year papers", icon: GraduationCap },
];

export default function NotFound() {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">This page does not exist</h1>
        <p className="mt-4 text-gray-400">
          The link may be old or mistyped. Search for the topic, or pick a section below.
        </p>

        <form action="/search" role="search" className="mx-auto mt-8 flex max-w-lg gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Search the site</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              name="q"
              placeholder="Search articles, quizzes, PYQs"
              className="w-full rounded-lg border border-line bg-panel/75 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
            />
          </label>
          <button type="submit" className="button-primary">
            Search
          </button>
        </form>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {destinations.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="card card-hover flex items-center gap-3 p-4 text-left">
              <Icon size={20} className="text-violet-300" />
              <span className="font-semibold">{label}</span>
            </Link>
          ))}
        </div>

        <Link href="/" className="mt-8 inline-block text-sm text-violet-400 hover:text-violet-300">
          Back to the home page
        </Link>
      </div>
    </section>
  );
}
