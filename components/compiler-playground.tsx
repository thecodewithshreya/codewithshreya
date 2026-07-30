"use client";

import { CheckCircle2, ChevronDown, Code2, Download, Play, RotateCcw } from "lucide-react";
import { useState } from "react";

const languageExamples = {
  python: {
    label: "Python",
    file: "main.py",
    code: 'name = input("Your name: ") or "Learner"\nprint(f"Keep coding, {name}!")',
    output: "Keep coding, Learner!",
  },
  csharp: {
    label: "C#",
    file: "Program.cs",
    code: 'using System;\n\nvar name = Console.ReadLine();\nif (string.IsNullOrWhiteSpace(name)) name = "Learner";\nConsole.WriteLine($"Keep coding, {name}!");',
    output: "Keep coding, Learner!",
  },
  javascript: {
    label: "JavaScript",
    file: "main.js",
    code: 'const name = "Learner";\nconsole.log(`Keep coding, ${name}!`);',
    output: "Keep coding, Learner!",
  },
  java: {
    label: "Java",
    file: "Main.java",
    code: 'class Main {\n  public static void main(String[] args) {\n    String name = "Learner";\n    System.out.println("Keep coding, " + name + "!");\n  }\n}',
    output: "Keep coding, Learner!",
  },
  cpp: {
    label: "C++",
    file: "main.cpp",
    code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string name = "Learner";\n  cout << "Keep coding, " << name << "!";\n  return 0;\n}',
    output: "Keep coding, Learner!",
  },
};

type LanguageId = keyof typeof languageExamples;

const initialOutput = "Run your code to see the output here.";
const runningOutput = "Running...";

export function CompilerPlayground() {
  const [language, setLanguage] = useState<LanguageId>("python");
  const [code, setCode] = useState(languageExamples.python.code);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(initialOutput);
  const [running, setRunning] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const activeLanguage = languageExamples[language];

  function changeLanguage(value: LanguageId) {
    setLanguage(value);
    setCode(languageExamples[value].code);
    setInput("");
    setOutput(initialOutput);
    setLanguageMenuOpen(false);
  }

  function runCode() {
    setRunning(true);
    setOutput(runningOutput);
    window.setTimeout(() => {
      const sample = input.trim()
        ? `Keep coding, ${input.trim()}!`
        : activeLanguage.output;
      setOutput(sample);
      setRunning(false);
    }, 550);
  }

  function resetCode() {
    setCode(activeLanguage.code);
    setInput("");
    setOutput(initialOutput);
  }

  function downloadCode() {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = activeLanguage.file;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#090d18] shadow-2xl">
      <div className="border-b border-line bg-gradient-to-r from-violet-500/10 via-panel to-cyan-500/5 px-4 py-4 sm:px-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
              <Code2 size={15} /> Online compiler
            </span>
            <h1 className="mt-2 text-2xl font-black text-white">Code playground</h1>
          </div>
          <div className="relative flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-400">Language</span>
            <button
              type="button"
              onClick={() => setLanguageMenuOpen((value) => !value)}
              className="compiler-language-button"
              aria-label="Select compiler language"
              aria-expanded={languageMenuOpen}
            >
              {activeLanguage.label}
              <ChevronDown size={16} className={languageMenuOpen ? "rotate-180 transition" : "transition"} />
            </button>
            {languageMenuOpen && (
              <div className="compiler-language-menu">
                {Object.entries(languageExamples).map(([id, example]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => changeLanguage(id as LanguageId)}
                    className={`compiler-language-option ${language === id ? "compiler-language-option-active" : ""}`}
                  >
                    <span>{example.label}</span>
                    <small>{example.file}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="hidden gap-1.5 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs text-gray-400">{activeLanguage.file}</span>
          <span className="rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-300">
            {activeLanguage.label}
          </span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={downloadCode} className="button-secondary !px-3 !py-2">
            <Download size={15} /> <span className="hidden sm:inline">Download</span>
          </button>
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
