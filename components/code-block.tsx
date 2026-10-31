"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";

type CopyState = "idle" | "copied" | "failed";

// <pre> with a copy button, used by both MDX articles and admin articles.
export function CodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(preRef.current?.textContent?.replace(/\n$/, "") ?? "");
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="code-block">
      <pre ref={preRef} {...props} />
      <button
        type="button"
        onClick={copy}
        className="code-copy"
        aria-label={state === "copied" ? "Code copied" : "Copy code"}
      >
        {state === "copied" ? <Check size={14} /> : <Copy size={14} />}
        <span>{state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy"}</span>
      </button>
    </div>
  );
}
