"use client";

import Link from "next/link";
import Image from "next/image";
import { socialLinks } from "@/lib/social";

const prepLinks = [
  ["GATE CSE preparation", "/gate"],
  ["Placement & interview prep", "/interview-prep"],
  ["All subjects", "/topics"],
  ["GATE previous papers", "/pyq"],
];

const productLinks = [
  ["Articles", "/blog"],
  ["Video Lessons", "/videos"],
  ["Online Compiler", "/compiler"],
  ["Practice Quizzes", "/quizzes"],
  ["Developer Tools", "/tools"],
];

const companyLinks = [
  ["About", "/about"],
  ["Contact", "/contact"],
  ["RSS feed", "/feed.xml"],
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-black/20">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2 font-bold">
            <Image
              src="/codewithshreya-logo-final.png"
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px]"
            />
            CodeWith<span className="-ml-2 text-[#6d35c5]">Shreya</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-gray-400">
            Computer science for GATE CSE aspirants and future software engineers: clear explanations, lectures,
            practice and real exam papers in one place.
          </p>
          {socialLinks.length ? (
            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-line text-gray-400 transition hover:border-violet-400 hover:text-violet-300"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <FooterColumn title="Prepare" links={prepLinks} />
        <FooterColumn title="Learn" links={productLinks} />
        <FooterColumn title="Site" links={companyLinks} />
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-gray-500 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} CodeWithShreya.{" "}
            All rights reserved.
          </span>
          <span>
            Learn. Code. Grow.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[][];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-4 flex flex-col gap-3">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="text-sm text-gray-400 hover:text-indigo-300">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
