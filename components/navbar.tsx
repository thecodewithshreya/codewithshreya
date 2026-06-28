"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Braces, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/videos", label: "Videos" },
  { href: "/compiler", label: "Compiler" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/pyq", label: "PYQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink/85 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-950">
            <Braces size={20} aria-hidden />
          </span>
          <span>CodeWith<span className="text-indigo-400">Shreya</span></span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-indigo-500/10 text-indigo-300"
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
            className="rounded-md border border-line p-2 text-gray-300"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="container-page grid grid-cols-2 gap-2 border-t border-line py-4 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-4 py-3 text-sm ${
                pathname === link.href
                  ? "bg-indigo-500/10 text-indigo-300"
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
