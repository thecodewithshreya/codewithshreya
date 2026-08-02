"use client";

import { CheckCircle2, ChevronDown, Code2, Download, Moon, Play, RotateCcw, Sun } from "lucide-react";
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
    code: 'using System;\n\nclass Program {\n  static void Main() {\n    var name = Console.ReadLine();\n    if (string.IsNullOrWhiteSpace(name)) name = "Learner";\n    Console.WriteLine($"Keep coding, {name}!");\n  }\n}',
    output: "Keep coding, Learner!",
  },
  javascript: {
    label: "JavaScript",
    file: "main.js",
    code: 'const fs = require("fs");\nconst name = fs.readFileSync(0, "utf8").trim() || "Learner";\nconsole.log(`Keep coding, ${name}!`);',
    output: "Keep coding, Learner!",
  },
  java: {
    label: "Java",
    file: "Main.java",
    code: 'import java.util.Scanner;\n\nclass Main {\n  public static void main(String[] args) {\n    Scanner scanner = new Scanner(System.in);\n    String name = scanner.hasNextLine() ? scanner.nextLine().trim() : "";\n    if (name.isEmpty()) name = "Learner";\n    System.out.println("Keep coding, " + name + "!");\n  }\n}',
    output: "Keep coding, Learner!",
  },
  cpp: {
    label: "C++",
    file: "main.cpp",
    code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string name;\n  getline(cin, name);\n  if (name.empty()) name = "Learner";\n  cout << "Keep coding, " << name << "!";\n  return 0;\n}',
    output: "Keep coding, Learner!",
  },
};

type LanguageId = keyof typeof languageExamples;

const initialOutput = "Run your code to see the output here.";
const runningOutput = "Running...";
type RunResponse = {
  output?: string;
  error?: string;
  success?: boolean;
};

export function CompilerPlayground() {
  const [language, setLanguage] = useState<LanguageId>("python");
  const [code, setCode] = useState(languageExamples.python.code);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(initialOutput);
  const [runSucceeded, setRunSucceeded] = useState(false);
  const [running, setRunning] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [compilerTheme, setCompilerTheme] = useState<"dark" | "light">("dark");
  const activeLanguage = languageExamples[language];
  const isCompilerLight = compilerTheme === "light";

  function changeLanguage(value: LanguageId) {
    setLanguage(value);
    setCode(languageExamples[value].code);
    setInput("");
    setOutput(initialOutput);
    setRunSucceeded(false);
    setLanguageMenuOpen(false);
  }

  async function runCode() {
    setRunning(true);
    setOutput(runningOutput);
    setRunSucceeded(false);

    try {
      const response = await fetch("/api/compiler/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code,
          input,
        }),
      });
      const result = await response.json() as RunResponse;

      if (!response.ok) {
        throw new Error(result.error || "Code execution failed.");
      }

      setOutput(result.output || "Program finished with no output.");
      setRunSucceeded(Boolean(result.success));
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "Code execution failed.");
      setRunSucceeded(false);
    } finally {
      setRunning(false);
    }
  }

  function resetCode() {
    setCode(activeLanguage.code);
    setInput("");
    setOutput(initialOutput);
    setRunSucceeded(false);
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
    <div className={`overflow-hidden rounded-2xl border shadow-2xl ${
      isCompilerLight ? "border-slate-200 bg-white" : "border-line bg-[#090d18]"
    }`}>
      <div className={`border-b px-4 py-4 sm:px-5 ${
        isCompilerLight
          ? "border-slate-200 bg-gradient-to-r from-violet-50 via-white to-cyan-50"
          : "border-line bg-gradient-to-r from-violet-500/10 via-panel to-cyan-500/5"
      }`}>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
              <Code2 size={15} /> Online compiler
            </span>
            <h1 className={`mt-2 text-2xl font-black ${isCompilerLight ? "text-slate-950" : "text-white"}`}>
              Code playground
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setCompilerTheme((theme) => (theme === "dark" ? "light" : "dark"))}
              className={`inline-flex h-12 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition ${
                isCompilerLight
                  ? "border-slate-200 bg-white text-slate-700 hover:border-violet-300"
                  : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-violet-400/50 hover:text-white"
              }`}
              aria-label="Change compiler theme"
            >
              {isCompilerLight ? <Moon size={16} /> : <Sun size={16} />}
              {isCompilerLight ? "Dark" : "White"}
            </button>
            <div className="compiler-language-field">
              <span className="compiler-language-label">Language</span>
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
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 ${
        isCompilerLight ? "border-slate-200 bg-white" : "border-line bg-panel"
      }`}>
        <div className="flex items-center gap-3">
          <div className="hidden gap-1.5 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className={`text-xs ${isCompilerLight ? "text-slate-600" : "text-gray-400"}`}>{activeLanguage.file}</span>
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
        <div className={`border-b lg:border-b-0 lg:border-r ${
          isCompilerLight ? "border-slate-200" : "border-line"
        }`}>
          <div className={`border-b px-4 py-2 text-xs uppercase tracking-widest ${
            isCompilerLight ? "border-slate-200 text-slate-500" : "border-line text-gray-600"
          }`}>Code editor</div>
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            aria-label="Code editor"
            className={`h-[26rem] w-full resize-none bg-transparent p-5 font-mono text-sm leading-7 outline-none ${
              isCompilerLight ? "text-slate-900" : "text-gray-200"
            }`}
          />
        </div>
        <div className="grid min-h-80 grid-rows-2 lg:h-[28.5rem]">
          <div className={isCompilerLight ? "border-b border-slate-200" : "border-b border-line"}>
            <div className={`border-b px-4 py-2 text-xs uppercase tracking-widest ${
              isCompilerLight ? "border-slate-200 text-slate-500" : "border-line text-gray-600"
            }`}>Input</div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Enter program input here..."
              aria-label="Input"
              className={`h-[calc(100%-2.25rem)] w-full resize-none bg-transparent p-4 font-mono text-sm outline-none ${
                isCompilerLight ? "text-slate-900 placeholder:text-slate-400" : "text-gray-300 placeholder:text-gray-700"
              }`}
            />
          </div>
          <div className={isCompilerLight ? "bg-slate-50" : "bg-black/20"}>
            <div className={`flex items-center justify-between border-b px-4 py-2 ${
              isCompilerLight ? "border-slate-200" : "border-line"
            }`}>
              <span className={`text-xs uppercase tracking-widest ${isCompilerLight ? "text-slate-500" : "text-gray-600"}`}>Output</span>
              {!running && output !== initialOutput && runSucceeded && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 size={13} /> Finished
                </span>
              )}
            </div>
            <pre className={`whitespace-pre-wrap p-4 font-mono text-sm ${
              output === initialOutput
                ? isCompilerLight ? "text-slate-500" : "text-gray-600"
                : runSucceeded ? "text-emerald-500" : "text-rose-400"
            }`}>
              {output}
            </pre>
          </div>
        </div>
      </div>
      <div className={`border-t px-4 py-2 text-center text-xs ${
        isCompilerLight ? "border-slate-200 bg-white text-slate-500" : "border-line bg-panel text-gray-600"
      }`}>
        Code runs through your configured Judge0 compiler service
      </div>
    </div>
  );
}
