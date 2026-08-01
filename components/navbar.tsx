"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/videos", label: "Videos" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/pyq", label: "PYQ" },
  { href: "/compiler", label: "Compiler" },
  { href: "/tools", label: "Tools" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 px-3 py-3">
      <nav className="site-navbar container-page flex h-16 items-center justify-between rounded-full border border-line/80 shadow-2xl shadow-black/10 backdrop-blur-xl">
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
          <span className="hidden text-xl font-bold text-slate-950 dark:text-white sm:inline">
            Code with Shreya
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  active
                    ? "bg-violet-500/10 text-violet-300"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <span className="ml-2">
            <ThemeToggle />
          </span>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg border border-line p-2 text-gray-300"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="container-page mt-2 grid grid-cols-2 gap-2 rounded-3xl border border-line bg-panel/95 p-4 shadow-2xl lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-4 py-3 text-sm ${
                pathname === link.href
                  ? "bg-gray-950 text-white"
                  : "text-gray-300 hover:bg-white/[0.04]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
