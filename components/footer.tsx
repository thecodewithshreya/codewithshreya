import Link from "next/link";
import { Braces, Github, Linkedin, Youtube } from "lucide-react";

const productLinks = [
  ["Articles", "/blog"],
  ["Video Lessons", "/videos"],
  ["Online Compiler", "/compiler"],
  ["Practice Quizzes", "/quizzes"],
];

const companyLinks = [
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Previous Papers", "/pyq"],
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-black/20">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600">
              <Braces size={18} />
            </span>
            CodeWith<span className="-ml-2 text-indigo-400">Shreya</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-gray-400">
            Practical computer science education for students who want to build
            strong fundamentals and real problem-solving skills.
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
        </div>
        <FooterColumn title="Learn" links={productLinks} />
        <FooterColumn title="Explore" links={companyLinks} />
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-gray-500 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} CodeWithShreya. All rights reserved.</span>
          <span>Learn. Code. Grow.</span>
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
