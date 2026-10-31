"use client";

import { CheckCircle2, ChevronDown, Code2, Download, Moon, Play, RotateCcw, Sun } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { indentEdit, newlineEdit, type TextEdit } from "@/lib/code-editing";

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
type CompilerTheme = "dark" | "light";
type SavedCode = Partial<Record<LanguageId, string>>;

// Python is indented with 4 spaces; the other starters use 2.
const indentUnit = (language: LanguageId) => (language === "python" ? "    " : "  ");

// The playground keeps your code (per language), language and theme in this
// browser, so a reload or a language switch does not throw work away.
const storageKey = "codewithshreya-compiler";

function isLanguage(value: unknown): value is LanguageId {
  return typeof value === "string" && value in languageExamples;
}

function readSaved(): { language?: LanguageId; theme?: CompilerTheme; code: SavedCode } {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (!saved || typeof saved !== "object") return { code: {} };

    const code: SavedCode = {};
    for (const [id, value] of Object.entries(saved.code ?? {})) {
      if (isLanguage(id) && typeof value === "string") code[id] = value;
    }

    return {
      language: isLanguage(saved.language) ? saved.language : undefined,
      theme: saved.theme === "light" || saved.theme === "dark" ? saved.theme : undefined,
      code,
    };
  } catch {
    return { code: {} };
  }
}

function writeSaved(language: LanguageId, theme: CompilerTheme, code: SavedCode) {
  // Untouched starter code is not worth keeping.
  const changed = Object.fromEntries(
    Object.entries(code).filter(([id, value]) => value !== languageExamples[id as LanguageId].code),
  );

  try {
    localStorage.setItem(storageKey, JSON.stringify({ language, theme, code: changed }));
  } catch {
    // Storage blocked or full: the playground still works, it just will not remember.
  }
}

// Applies an edit through the browser's own editing so Ctrl+Z still undoes it.
function applyEdit(textarea: HTMLTextAreaElement, edit: TextEdit, setCode: (value: string) => void) {
  textarea.setSelectionRange(edit.start, edit.end);
  const inserted = edit.text !== "" && document.execCommand?.("insertText", false, edit.text);

  if (!inserted) {
    textarea.setRangeText(edit.text, edit.start, edit.end, "end");
    setCode(textarea.value);
  }

  textarea.setSelectionRange(edit.selectionStart, edit.selectionEnd);
}

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
  const [compilerTheme, setCompilerTheme] = useState<CompilerTheme>("dark");
  const [savedCode, setSavedCode] = useState<SavedCode>({});
  const [restored, setRestored] = useState(false);
  // After Escape, Tab moves focus out of the editor instead of indenting.
  const tabLeavesEditor = useRef(false);
  const activeLanguage = languageExamples[language];
  const isCompilerLight = compilerTheme === "light";

  // Read after mount: the server render cannot know what this browser saved.
  useEffect(() => {
    const saved = readSaved();
    const savedLanguage = saved.language ?? "python";
    setSavedCode(saved.code);
    setLanguage(savedLanguage);
    setCode(saved.code[savedLanguage] ?? languageExamples[savedLanguage].code);
    if (saved.theme) setCompilerTheme(saved.theme);
    setRestored(true);
  }, []);

  useEffect(() => {
    if (restored) writeSaved(language, compilerTheme, { ...savedCode, [language]: code });
  }, [restored, language, compilerTheme, savedCode, code]);

  function changeLanguage(value: LanguageId) {
    if (value === language) {
      setLanguageMenuOpen(false);
      return;
    }

    const nextSaved = { ...savedCode, [language]: code };
    setSavedCode(nextSaved);
    setLanguage(value);
    setCode(nextSaved[value] ?? languageExamples[value].code);
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
    if (code !== activeLanguage.code && !window.confirm(`Replace your ${activeLanguage.label} code with the starter example?`)) {
      return;
    }

    setCode(activeLanguage.code);
    setInput("");
    setOutput(initialOutput);
    setRunSucceeded(false);
  }

  function handleEditorKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing) return;
    const textarea = event.currentTarget;
    const unit = indentUnit(language);

    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (!running) void runCode();
      return;
    }

    if (event.key === "Escape") {
      tabLeavesEditor.current = true;
      return;
    }

    if (event.key === "Tab" && !tabLeavesEditor.current && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      const edit = indentEdit(code, textarea.selectionStart, textarea.selectionEnd, unit, event.shiftKey);
      if (edit) applyEdit(textarea, edit, setCode);
      return;
    }

    if (event.key === "Enter" && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      applyEdit(textarea, newlineEdit(code, textarea.selectionStart, textarea.selectionEnd, unit), setCode);
      return;
    }

    if (event.key !== "Tab" && event.key !== "Shift") tabLeavesEditor.current = false;
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (!running) void runCode();
    }
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
      isCompilerLight ? "compiler-light border-slate-200 bg-white" : "compiler-dark border-line bg-[#090d18]"
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
          <span className={`rounded bg-blue-500/10 px-2 py-1 text-xs ${isCompilerLight ? "text-blue-700" : "text-blue-300"}`}>
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
          <div className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b px-4 py-2 text-xs ${
            isCompilerLight ? "border-slate-200 text-slate-500" : "border-line text-gray-400"
          }`}>
            <span className="uppercase tracking-widest">Code editor</span>
            <span id="code-editor-keys">Tab indents · Esc then Tab leaves the editor · Ctrl+Enter runs</span>
          </div>
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={handleEditorKeyDown}
            onFocus={() => {
              tabLeavesEditor.current = false;
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Code editor"
            aria-describedby="code-editor-keys"
            className={`h-[26rem] w-full resize-none bg-transparent p-5 font-mono text-sm leading-7 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500/50 ${
              isCompilerLight ? "text-slate-900" : "text-gray-200"
            }`}
          />
        </div>
        <div className="grid min-h-80 grid-rows-2 lg:h-[28.5rem]">
          <div className={isCompilerLight ? "border-b border-slate-200" : "border-b border-line"}>
            <div className={`border-b px-4 py-2 text-xs uppercase tracking-widest ${
              isCompilerLight ? "border-slate-200 text-slate-500" : "border-line text-gray-400"
            }`}>Input</div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Enter program input here..."
              aria-label="Input"
              className={`h-[calc(100%-2.25rem)] w-full resize-none bg-transparent p-4 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500/50 ${
                isCompilerLight ? "text-slate-900 placeholder:text-slate-400" : "text-gray-300 placeholder:text-gray-500"
              }`}
            />
          </div>
          <div className={isCompilerLight ? "bg-slate-50" : "bg-black/20"}>
            <div className={`flex items-center justify-between border-b px-4 py-2 ${
              isCompilerLight ? "border-slate-200" : "border-line"
            }`}>
              <span className={`text-xs uppercase tracking-widest ${isCompilerLight ? "text-slate-500" : "text-gray-400"}`}>Output</span>
              {!running && output !== initialOutput && runSucceeded && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 size={13} /> Finished
                </span>
              )}
            </div>
            <pre className={`whitespace-pre-wrap p-4 font-mono text-sm ${
              output === initialOutput
                ? isCompilerLight ? "text-slate-500" : "text-gray-400"
                : runSucceeded ? "text-emerald-500" : "text-rose-400"
            }`}>
              {output}
            </pre>
          </div>
        </div>
      </div>
      <div className={`border-t px-4 py-2 text-center text-xs ${
        isCompilerLight ? "border-slate-200 bg-white text-slate-500" : "border-line bg-panel text-gray-400"
      }`}>
        Code runs through your configured Judge0 compiler service
      </div>
    </div>
  );
}
