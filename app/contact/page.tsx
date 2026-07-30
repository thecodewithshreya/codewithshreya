import type { Metadata } from "next";
import { Github, Linkedin, Mail, MessageCircle, Youtube } from "lucide-react";

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
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="card p-7">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Mail size={23} />
            </span>
            <h2 className="mt-5 text-xl font-semibold">Email</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              For questions, content suggestions, and general inquiries.
            </p>
            <a href="mailto:thecodewithshreya@gmail.com" className="mt-5 inline-block text-sm font-medium text-indigo-400">
              thecodewithshreya@gmail.com
            </a>
          </div>
          <div className="card p-7">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
              <MessageCircle size={23} />
            </span>
            <h2 className="mt-5 text-xl font-semibold">Connect socially</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Follow new lessons, videos, and platform updates.
            </p>
            <div className="mt-5 flex gap-3">
              {[Youtube, Github, Linkedin].map((Icon, index) => (
                <span key={index} className="grid h-10 w-10 place-items-center rounded-lg border border-line text-gray-400">
                  <Icon size={18} />
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">Social links coming soon</p>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-4xl rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06] p-5 text-center text-sm text-gray-400">
          We typically respond to emails within 2-3 working days.
        </div>
      </section>
    </>
  );
}
