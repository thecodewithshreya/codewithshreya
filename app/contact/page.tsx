import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { socialLinks } from "@/lib/social";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with CodeWithShreya.",
};

export default function ContactPage() {
  return (
    <>
      <section className="container-page py-10">
        <div className="mx-auto mb-8 max-w-4xl">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-2 text-3xl font-black text-white">Get in touch</h1>
        </div>
        <div className={`mx-auto grid max-w-4xl gap-6 ${socialLinks.length ? "md:grid-cols-2" : ""}`}>
          <div className="card p-7">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
              <Mail size={23} />
            </span>
            <h2 className="mt-5 text-xl font-semibold">Email</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              For questions, content suggestions, and general inquiries.
            </p>
            <a href="mailto:thecodewithshreya@gmail.com" className="mt-5 inline-block text-sm font-medium text-violet-400">
              thecodewithshreya@gmail.com
            </a>
          </div>
          {socialLinks.length ? (
          <div className="card p-7">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
              <MessageCircle size={23} />
            </span>
            <h2 className="mt-5 text-xl font-semibold">Connect socially</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Follow new lessons, videos, and platform updates.
            </p>
            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-line text-gray-400 transition hover:border-violet-400 hover:text-violet-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          ) : null}
        </div>
        <div className="mx-auto mt-8 max-w-4xl rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-5 text-center text-sm text-gray-400">
          We typically respond to emails within 2-3 working days.
        </div>
      </section>
    </>
  );
}
