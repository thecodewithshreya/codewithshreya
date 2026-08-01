"use client";

import { ArrowRight, Download, ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function PyqCardActions({
  title,
  viewUrl,
  previewUrl,
  downloadUrl,
}: {
  title: string;
  viewUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const modal =
    mounted && isOpen
      ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} preview`}
          onMouseDown={() => setIsOpen(false)}
        >
          <div
            className="flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/40 dark:bg-[#080b14]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-950 dark:text-white">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF reader</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={viewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-line text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.07]"
                  aria-label={`Open ${title} in Google Drive`}
                  title="Open in Drive"
                >
                  <ExternalLink size={16} />
                </a>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-line text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.07]"
                  aria-label={`Download ${title} PDF`}
                  title="Download PDF"
                >
                  <Download size={16} />
                </a>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-line text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.07]"
                  aria-label="Close preview"
                  title="Close"
                >
                  <X size={17} />
                </button>
              </div>
            </div>
            <iframe
              src={previewUrl}
              title={`${title} PDF preview`}
              className="h-full w-full bg-white"
              loading="lazy"
              allow="autoplay"
            />
          </div>
        </div>,
        document.body,
      )
      : null;

  return (
    <>
      <div className="mt-4 flex items-center justify-between border-t border-line bg-white/40 px-4 py-3 dark:bg-[#0b0f1a]">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5f33d7] transition hover:text-[#4e23ba]"
        >
          View <ArrowRight size={14} />
        </button>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noreferrer"
          className="grid h-9 w-9 place-items-center rounded-lg border border-violet-200 bg-white text-[#5f33d7] shadow-lg shadow-violet-900/10 transition hover:border-violet-300 hover:bg-violet-50 dark:border-violet-500/35 dark:bg-[#141a2b] dark:text-violet-300 dark:hover:bg-violet-500/20"
          aria-label={`Download ${title} PDF`}
          title="Download PDF"
        >
          <Download size={16} />
        </a>
      </div>
      {modal}
    </>
  );
}
