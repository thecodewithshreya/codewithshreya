"use client";

import { CheckCircle2, Play, RotateCcw } from "lucide-react";
import { useState } from "react";

const pythonExample = {
  file: "main.py",
  code: 'name = input("Your name: ") or "Learner"\nprint(f"Keep coding, {name}!")',
  output: "Keep coding, Learner!",
};

const initialOutput = "Run your code to see the output here.";
const runningOutput = "Running...";

export function CompilerPlayground() {
  const [code, setCode] = useState(pythonExample.code);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(initialOutput);
  const [running, setRunning] = useState(false);

  function runCode() {
    setRunning(true);
    setOutput(runningOutput);
    window.setTimeout(() => {
      const sample = input.trim()
        ? `Keep coding, ${input.trim()}!`
        : pythonExample.output;
      setOutput(sample);
      setRunning(false);
    }, 550);
  }

  function resetCode() {
    setCode(pythonExample.code);
    setInput("");
    setOutput(initialOutput);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#090d18] shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="hidden gap-1.5 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs text-gray-400">{pythonExample.file}</span>
          <span className="rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-300">Python</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={resetCode} className="button-secondary !px-3 !py-2">
            <RotateCcw size={15} /> <span className="hidden sm:inline">Reset</span>
          </button>
          <button type="button" onClick={runCode} disabled={running} className="button-primary !px-4 !py-2 disabled:opacity-60">
            <Play size={15} fill="currentColor" /> {running ? "Running" : "Run Code"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_21rem]">
        <div className="border-b border-line lg:border-b-0 lg:border-r">
          <div className="border-b border-line px-4 py-2 text-xs uppercase tracking-widest text-gray-600">Code editor</div>
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            aria-label="Code editor"
            className="h-[26rem] w-full resize-none bg-transparent p-5 font-mono text-sm leading-7 text-gray-200 outline-none"
          />
        </div>
        <div className="grid min-h-80 grid-rows-2 lg:h-[28.5rem]">
          <div className="border-b border-line">
            <div className="border-b border-line px-4 py-2 text-xs uppercase tracking-widest text-gray-600">Input</div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Enter program input here..."
              aria-label="Input"
              className="h-[calc(100%-2.25rem)] w-full resize-none bg-transparent p-4 font-mono text-sm text-gray-300 outline-none placeholder:text-gray-700"
            />
          </div>
          <div className="bg-black/20">
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <span className="text-xs uppercase tracking-widest text-gray-600">Output</span>
              {!running && output !== initialOutput && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 size={13} /> Finished
                </span>
              )}
            </div>
            <pre className={`whitespace-pre-wrap p-4 font-mono text-sm ${
              output === initialOutput ? "text-gray-600" : "text-emerald-400"
            }`}>
              {output}
            </pre>
          </div>
        </div>
      </div>
      <div className="border-t border-line bg-panel px-4 py-2 text-center text-xs text-gray-600">
        Demo mode - sample output only - no code is sent to a server
      </div>
    </div>
  );
}
