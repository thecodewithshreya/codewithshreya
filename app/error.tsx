"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">This page could not load</h1>
        <p className="mt-4 text-gray-400">
          It is usually temporary. Try again, or come back in a minute.
        </p>
        {error.digest ? <p className="mt-2 text-xs text-gray-600">Error reference: {error.digest}</p> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" className="button-primary" onClick={() => unstable_retry()}>
            <RotateCcw size={16} />
            Try again
          </button>
          <Link href="/" className="button-secondary">
            Go to home page
          </Link>
        </div>
      </div>
    </section>
  );
}
