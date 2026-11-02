"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

type NavLink = { href: string; label: string; description?: string };
type NavGroup = { label: string; links: NavLink[] };
type NavItem = NavLink | NavGroup;

// "Home" is the logo. GATE and Job prep lead, since they are the two reasons people visit;
// everything else sits in three small menus so the bar stays short.
const items: NavItem[] = [
  { href: "/gate", label: "GATE" },
  { href: "/interview-prep", label: "Job prep" },
  {
    label: "Learn",
    links: [
      { href: "/topics", label: "Subjects", description: "Everything for one subject in one place" },
      { href: "/blog", label: "Articles", description: "Clear written explanations" },
      { href: "/videos", label: "Videos", description: "Lectures and walkthroughs" },
    ],
  },
  {
    label: "Practice",
    links: [
      { href: "/quizzes", label: "Quizzes", description: "Topic quizzes with explanations" },
      { href: "/pyq", label: "GATE papers", description: "Previous year question papers" },
    ],
  },
  {
    label: "Tools",
    links: [
      { href: "/compiler", label: "Compiler", description: "Run Python, C#, Java, C++ and JavaScript" },
      { href: "/tools", label: "Developer tools", description: "Formatters and number converters" },
    ],
  },
];

const isGroup = (item: NavItem): item is NavGroup => "links" in item;

// A section stays highlighted on its sub-pages, e.g. Learn on /blog/<slug>.
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemActive(pathname: string, item: NavItem) {
  return isGroup(item) ? item.links.some((link) => isActive(pathname, link.href)) : isActive(pathname, item.href);
}

const pill = (active: boolean) =>
  `flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm transition ${
    active ? "bg-violet-500/10 text-violet-300" : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
  }`;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);

  // Close menus on navigation, on Escape and on a click outside the bar.
  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenGroup(null);
      if (event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        router.push("/search");
      }
    }
    function onClick(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenGroup(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [router]);

  return (
    <header className="sticky top-0 z-50 px-3 py-3">
      <nav
        ref={navRef}
        className="site-navbar container-page flex h-16 items-center justify-between gap-4 rounded-full border border-line/80 shadow-2xl shadow-black/10 backdrop-blur-xl"
      >
        <Link href="/" aria-label="CodeWithShreya home" className="flex min-w-fit items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
            <Image
              src="/codewithshreya-logo-final.png"
              alt=""
              width={38}
              height={38}
              priority
              className="h-9 w-9 object-contain"
            />
          </span>
          <span className="hidden text-xl font-bold text-slate-950 dark:text-white sm:inline">Code with Shreya</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {items.map((item) =>
            isGroup(item) ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenGroup(item.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  type="button"
                  className={pill(itemActive(pathname, item))}
                  aria-expanded={openGroup === item.label}
                  onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    aria-hidden
                    className={`transition ${openGroup === item.label ? "rotate-180" : ""}`}
                  />
                </button>
                {openGroup === item.label ? (
                  // pt-2 bridges the gap so the menu stays open while the pointer moves down to it.
                  <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-2">
                    <ul className="grid gap-1 rounded-2xl border border-line bg-panel p-2 shadow-2xl shadow-black/20">
                      {item.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            aria-current={isActive(pathname, link.href) ? "page" : undefined}
                            className="block rounded-xl px-3 py-2.5 transition hover:bg-violet-500/10"
                          >
                            <span className="block text-sm font-semibold text-white">{link.label}</span>
                            <span className="mt-0.5 block text-xs text-gray-400">{link.description}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={pill(isActive(pathname, item.href))}
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-gray-400 transition hover:border-violet-500/60 hover:text-white xl:flex"
          >
            <Search size={16} aria-hidden />
            <span className="w-24">Search…</span>
            <kbd className="rounded border border-line px-1.5 text-[11px] font-sans">Ctrl K</kbd>
          </Link>
          <Link
            href="/search"
            aria-label="Search"
            title="Search (Ctrl K)"
            className={`grid h-9 w-9 place-items-center rounded-full transition xl:hidden ${
              pathname === "/search"
                ? "bg-violet-500/10 text-violet-300"
                : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <Search size={18} />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="rounded-lg border border-line p-2 text-gray-300 lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="container-page mt-2 grid gap-4 rounded-3xl border border-line bg-panel/95 p-4 shadow-2xl lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {items.filter((item): item is NavLink => !isGroup(item)).map((link) => (
              <MobileLink key={link.href} link={link} active={isActive(pathname, link.href)} strong />
            ))}
          </div>
          {items.filter(isGroup).map((group) => (
            <div key={group.label}>
              <p className="px-1 text-xs font-bold uppercase tracking-wider text-gray-500">{group.label}</p>
              <div className="mt-1 grid grid-cols-2 gap-1">
                {group.links.map((link) => (
                  <MobileLink key={link.href} link={link} active={isActive(pathname, link.href)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

function MobileLink({ link, active, strong = false }: { link: NavLink; active: boolean; strong?: boolean }) {
  return (
    <Link
      href={link.href}
      className={`rounded-lg px-4 py-3 text-sm ${strong ? "font-semibold" : ""} ${
        active ? "bg-gray-950 !text-white" : "text-gray-300 hover:bg-white/[0.04]"
      }`}
    >
      {link.label}
    </Link>
  );
}
