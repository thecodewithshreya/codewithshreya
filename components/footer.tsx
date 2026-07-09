"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Youtube } from "lucide-react";
import { T, useI18n } from "@/components/i18n-provider";

const productLinks = [
  ["footer.articles", "/blog"],
  ["footer.videoLessons", "/videos"],
  ["footer.onlineCompiler", "/compiler"],
  ["footer.practiceQuizzes", "/quizzes"],
];

const companyLinks = [
  ["nav.about", "/about"],
  ["nav.contact", "/contact"],
  ["footer.previousPapers", "/pyq"],
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-black/20">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
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
            <T k="footer.description" />
          </p>
          <div className="mt-5 flex gap-3">
            {[Youtube, Github, Linkedin].map((Icon, index) => (
              <span
                key={index}
                className="grid h-9 w-9 place-items-center rounded-lg border border-line text-gray-400"
              >
                <Icon size={17} />
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            <T k="footer.socialSoon" />
          </p>
        </div>
        <FooterColumn titleKey="footer.learn" links={productLinks} />
        <FooterColumn titleKey="footer.explore" links={companyLinks} />
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-gray-500 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} CodeWithShreya.{" "}
            <T k="footer.rights" />
          </span>
          <span>
            <T k="footer.tagline" />
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  titleKey,
  links,
}: {
  titleKey: string;
  links: string[][];
}) {
  const { t } = useI18n();

  return (
    <div>
      <h3 className="text-sm font-semibold">{t(titleKey)}</h3>
      <div className="mt-4 flex flex-col gap-3">
        {links.map(([labelKey, href]) => (
          <Link key={href} href={href} className="text-sm text-gray-400 hover:text-indigo-300">
            {t(labelKey)}
          </Link>
        ))}
      </div>
    </div>
  );
}
