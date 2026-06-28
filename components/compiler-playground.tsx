"use client";

import { CheckCircle2, Code2, Database, Play, RotateCcw } from "lucide-react";
import { useState } from "react";

const languages = {
  C: {
    file: "main.c",
    code: '#include <stdio.h>\n\nint main() {\n    printf("Hello, CodeWithShreya!");\n    return 0;\n}',
    output: "Hello, CodeWithShreya!",
  },
  "C++": {
    file: "main.cpp",
    code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, CodeWithShreya!";\n    return 0;\n}',
    output: "Hello, CodeWithShreya!",
  },
  Java: {
    file: "Main.java",
    code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeWithShreya!");\n    }\n}',
    output: "Hello, CodeWithShreya!",
  },
  Python: {
    file: "main.py",
    code: 'name = input("Your name: ") or "Learner"\nprint(f"Keep coding, {name}!")',
    output: "Keep coding, Learner!",
  },
  JavaScript: {
    file: "index.js",
    code: 'const topic = "Computer Science";\nconsole.log(`Learning ${topic} is fun!`);',
    output: "Learning Computer Science is fun!",
  },
  SQL: {
    file: "query.sql",
    code: "SELECT name, score\nFROM students\nWHERE score >= 80\nORDER BY score DESC;",
    output: "Shreya  |  96\nAarav   |  91\nMeera   |  84",
  },
} as const;

type Language = keyof typeof languages;

export function CompilerPlayground() {
  const [language, setLanguage] = useState<Language>("Python");
  const [code, setCode] = useState<string>(languages.Python.code);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Run your code to see the output here.");
  const [running, setRunning] = useState(false);

  function chooseLanguage(next: Language) {
    setLanguage(next);
    setCode(languages[next].code);
    setOutput("Run your code to see the output here.");
  }

  function runCode() {
    setRunning(true);
    setOutput("Running...");
    window.setTimeout(() => {
      const sample = language === "Python" && input.trim()
        ? `Keep coding, ${input.trim()}!`
        : languages[language].output;
      setOutput(sample);
      setRunning(false);
    }, 550);
  }

  function resetCode() {
    setCode(languages[language].code);
    setInput("");
    setOutput("Run your code to see the output here.");
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(languages) as Language[]).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => chooseLanguage(name)}
            className={`card flex items-center gap-3 p-4 text-left transition ${
              language === name ? "border-indigo-500 bg-indigo-500/10" : "hover:border-indigo-500/40"
            }`}
          >
            <span className={`grid h-9 w-9 place-items-center rounded-lg ${
              language === name ? "bg-indigo-500 text-white" : "bg-white/[0.04] text-gray-400"
            }`}>
              {name === "SQL" ? <Database size={18} /> : <Code2 size={18} />}
            </span>
            <span className="text-sm font-medium">{name}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-[#090d18] shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="hidden gap-1.5 sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-xs text-gray-400">{languages[language].file}</span>
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
                aria-label="Program input"
                className="h-[calc(100%-2.25rem)] w-full resize-none bg-transparent p-4 font-mono text-sm text-gray-300 outline-none placeholder:text-gray-700"
              />
            </div>
            <div className="bg-black/20">
              <div className="flex items-center justify-between border-b border-line px-4 py-2">
                <span className="text-xs uppercase tracking-widest text-gray-600">Output</span>
                {!running && output !== "Run your code to see the output here." && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 size={13} /> Finished
                  </span>
                )}
              </div>
              <pre className={`whitespace-pre-wrap p-4 font-mono text-sm ${
                output.startsWith("Run") ? "text-gray-600" : "text-emerald-400"
              }`}>
                {output}
              </pre>
            </div>
          </div>
        </div>
        <div className="border-t border-line bg-panel px-4 py-2 text-center text-xs text-gray-600">
          Demo mode · Sample output only · No code is sent to a server
        </div>
      </div>
    </div>
  );
}
