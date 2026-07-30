"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Binary,
  Braces,
  Calculator,
  FileCode2,
  GitCompareArrows,
  Regex,
} from "lucide-react";

const sampleJson = `{"name":"Code with Shreya","topics":["C#","SQL","DSA"],"active":true}`;
const sampleCode = `function learn(topic){console.log("Learning " + topic);return topic.toUpperCase();}`;

type ToolId = "json" | "code" | "number" | "regex" | "base" | "diff";

const tools = [
  { id: "json", title: "JSON Formatter", text: "Format and validate JSON.", icon: FileCode2 },
  { id: "code", title: "Code Formatter", text: "Clean simple code spacing.", icon: Braces },
  { id: "number", title: "Number Converter", text: "Convert decimal, binary, octal, hex.", icon: Binary },
  { id: "regex", title: "Regex Tester", text: "Test matches against text.", icon: Regex },
  { id: "base", title: "Base Calculator", text: "Add numbers in any base.", icon: Calculator },
  { id: "diff", title: "Code Diff", text: "Compare two text versions.", icon: GitCompareArrows },
] as const;

export function ToolsWorkspace() {
  const [activeTool, setActiveTool] = useState<ToolId>("json");

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (isToolId(id)) setActiveTool(id);
  }, []);

  function chooseTool(id: ToolId) {
    setActiveTool(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <div className="tools-workspace">
      <div className="tools-card-grid">
        {tools.map(({ id, title, text, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => chooseTool(id)}
            className={`tool-select-card ${activeTool === id ? "tool-select-card-active" : ""}`}
          >
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-500/10 text-violet-300">
              <Icon size={20} />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="card tools-panel p-5 sm:p-6">
        {activeTool === "json" && <JsonFormatter />}
        {activeTool === "code" && <CodeFormatter />}
        {activeTool === "number" && <NumberConverter />}
        {activeTool === "regex" && <RegexTester />}
        {activeTool === "base" && <BaseCalculator />}
        {activeTool === "diff" && <CodeDiff />}
      </div>
    </div>
  );
}

function isToolId(value: string): value is ToolId {
  return tools.some((tool) => tool.id === value);
}

function JsonFormatter() {
  const [input, setInput] = useState(sampleJson);

  const result = useMemo(() => {
    try {
      return { output: JSON.stringify(JSON.parse(input), null, 2), error: "" };
    } catch (error) {
      return { output: "", error: error instanceof Error ? error.message : "Invalid JSON" };
    }
  }, [input]);

  return (
    <ToolShell title="JSON Formatter" result={result.error || result.output} error={result.error}>
      <ToolTextarea value={input} onChange={setInput} />
    </ToolShell>
  );
}

function CodeFormatter() {
  const [input, setInput] = useState(sampleCode);
  const output = useMemo(
    () =>
      input
        .replace(/\s*{\s*/g, " {\n  ")
        .replace(/;\s*/g, ";\n  ")
        .replace(/\s*}\s*/g, "\n}")
        .replace(/\n\s*\n/g, "\n")
        .trim(),
    [input],
  );

  return (
    <ToolShell title="Code Formatter" result={output}>
      <ToolTextarea value={input} onChange={setInput} />
    </ToolShell>
  );
}

function NumberConverter() {
  const [value, setValue] = useState("42");
  const [base, setBase] = useState("10");
  const decimal = parseInt(value || "0", Number(base));
  const valid = Number.isFinite(decimal) && !Number.isNaN(decimal);
  const result = valid
    ? `Decimal: ${decimal}\nBinary: ${decimal.toString(2)}\nOctal: ${decimal.toString(8)}\nHex: ${decimal.toString(16).toUpperCase()}`
    : "Enter a valid number for the selected base.";

  return (
    <ToolShell title="Number Converter" result={result} error={!valid ? result : ""}>
      <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
        <input className="tool-input" value={value} onChange={(event) => setValue(event.target.value)} />
        <select className="tool-input" value={base} onChange={(event) => setBase(event.target.value)}>
          <option value="10">Decimal</option>
          <option value="2">Binary</option>
          <option value="8">Octal</option>
          <option value="16">Hex</option>
        </select>
      </div>
    </ToolShell>
  );
}

function RegexTester() {
  const [pattern, setPattern] = useState("\\bcode\\b");
  const [text, setText] = useState("code with shreya helps you code daily");

  const result = useMemo(() => {
    try {
      const matches = [...text.matchAll(new RegExp(pattern, "gi"))].map((match) => match[0]);
      return matches.length ? `${matches.length} match(es): ${matches.join(", ")}` : "No matches found.";
    } catch (error) {
      return error instanceof Error ? error.message : "Invalid regex";
    }
  }, [pattern, text]);

  return (
    <ToolShell title="Regex Tester" result={result}>
      <input className="tool-input mb-3" value={pattern} onChange={(event) => setPattern(event.target.value)} />
      <ToolTextarea value={text} onChange={setText} />
    </ToolShell>
  );
}

function BaseCalculator() {
  const [left, setLeft] = useState("1010");
  const [right, setRight] = useState("11");
  const [base, setBase] = useState("2");
  const first = parseInt(left || "0", Number(base));
  const second = parseInt(right || "0", Number(base));
  const valid = [first, second].every((number) => Number.isFinite(number) && !Number.isNaN(number));
  const sum = first + second;
  const result = valid
    ? `${left} + ${right} = ${sum.toString(Number(base)).toUpperCase()} (base ${base})\nDecimal answer: ${sum}`
    : "Enter valid values for the selected base.";

  return (
    <ToolShell title="Base Calculator" result={result} error={!valid ? result : ""}>
      <div className="grid gap-3 sm:grid-cols-3">
        <input className="tool-input" value={left} onChange={(event) => setLeft(event.target.value)} />
        <input className="tool-input" value={right} onChange={(event) => setRight(event.target.value)} />
        <select className="tool-input" value={base} onChange={(event) => setBase(event.target.value)}>
          <option value="2">Base 2</option>
          <option value="8">Base 8</option>
          <option value="10">Base 10</option>
          <option value="16">Base 16</option>
        </select>
      </div>
    </ToolShell>
  );
}

function CodeDiff() {
  const [oldText, setOldText] = useState("public class User { }");
  const [newText, setNewText] = useState("public class UserProfile { }");

  const blocks = useMemo(() => buildDiffBlocks(oldText, newText), [oldText, newText]);

  const changedLines = blocks.filter((block) => block.kind === "change").length;

  function swapVersions() {
    setOldText(newText);
    setNewText(oldText);
  }

  function clearVersions() {
    setOldText("");
    setNewText("");
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-3xl font-black text-white">Code Diff</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Compare two versions. Red shows the old text, green shows the new text.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="diff-control-button" onClick={swapVersions}>
            Swap
          </button>
          <button type="button" className="diff-control-button" onClick={clearVersions}>
            Clear
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <label>
          <span className="tool-field-label">Old version</span>
          <ToolTextarea value={oldText} onChange={setOldText} />
        </label>
        <label>
          <span className="tool-field-label">New version</span>
          <ToolTextarea value={newText} onChange={setNewText} />
        </label>
      </div>
      <div className="diff-summary mt-4">
        {changedLines === 0 ? "No difference found." : `${changedLines} changed line(s) found.`}
      </div>
      <div className="diff-output mt-4">
        {blocks.map((block, index) =>
          block.kind === "same" ? (
            <div key={`same-${block.oldNumber}-${block.newNumber}-${index}`} className="diff-line diff-line-same">
              <span>Same {block.oldNumber}</span>
              <code>{block.text || "(empty line)"}</code>
            </div>
          ) : (
            <div key={`change-${index}`} className="diff-change">
              {block.oldLine && (
                <div className="diff-line diff-line-removed">
                  <span>Old {block.oldLine.number}</span>
                  <code>{block.oldLine.text || "(empty line)"}</code>
                </div>
              )}
              {block.newLine && (
                <div className="diff-line diff-line-added">
                  <span>New {block.newLine.number}</span>
                  <code>{block.newLine.text || "(empty line)"}</code>
                </div>
              )}
              {!block.oldLine && block.newLine && (
                <div className="diff-line diff-line-removed diff-line-empty">
                  <span>Old</span>
                  <code>(line inserted)</code>
                </div>
              )}
              {block.oldLine && !block.newLine && (
                <div className="diff-line diff-line-added diff-line-empty">
                  <span>New</span>
                  <code>(line deleted)</code>
                </div>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

type DiffLine = {
  kind: "same" | "removed" | "added";
  text: string;
  oldNumber?: number;
  newNumber?: number;
};

type DiffBlock =
  | {
      kind: "same";
      text: string;
      oldNumber: number;
      newNumber: number;
    }
  | {
      kind: "change";
      oldLine?: { number: number; text: string };
      newLine?: { number: number; text: string };
    };

function buildDiffBlocks(oldText: string, newText: string): DiffBlock[] {
  const rows = buildLineDiff(oldText, newText);
  const blocks: DiffBlock[] = [];

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const next = rows[index + 1];

    if (row.kind === "same") {
      blocks.push({
        kind: "same",
        text: row.text,
        oldNumber: row.oldNumber ?? 0,
        newNumber: row.newNumber ?? 0,
      });
      continue;
    }

    if (row.kind === "removed" && next?.kind === "added") {
      blocks.push({
        kind: "change",
        oldLine: { number: row.oldNumber ?? 0, text: row.text },
        newLine: { number: next.newNumber ?? 0, text: next.text },
      });
      index += 1;
      continue;
    }

    if (row.kind === "added" && next?.kind === "removed") {
      blocks.push({
        kind: "change",
        oldLine: { number: next.oldNumber ?? 0, text: next.text },
        newLine: { number: row.newNumber ?? 0, text: row.text },
      });
      index += 1;
      continue;
    }

    blocks.push(
      row.kind === "removed"
        ? {
            kind: "change",
            oldLine: { number: row.oldNumber ?? 0, text: row.text },
          }
        : {
            kind: "change",
            newLine: { number: row.newNumber ?? 0, text: row.text },
          },
    );
  }

  return blocks;
}

function buildLineDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = normalizeDiffLines(oldText);
  const newLines = normalizeDiffLines(newText);
  const table = Array.from({ length: oldLines.length + 1 }, () =>
    Array.from({ length: newLines.length + 1 }, () => 0),
  );

  for (let oldIndex = oldLines.length - 1; oldIndex >= 0; oldIndex -= 1) {
    for (let newIndex = newLines.length - 1; newIndex >= 0; newIndex -= 1) {
      table[oldIndex][newIndex] =
        oldLines[oldIndex] === newLines[newIndex]
          ? table[oldIndex + 1][newIndex + 1] + 1
          : Math.max(table[oldIndex + 1][newIndex], table[oldIndex][newIndex + 1]);
    }
  }

  const rows: DiffLine[] = [];
  let oldIndex = 0;
  let newIndex = 0;

  while (oldIndex < oldLines.length && newIndex < newLines.length) {
    if (oldLines[oldIndex] === newLines[newIndex]) {
      rows.push({
        kind: "same",
        text: oldLines[oldIndex],
        oldNumber: oldIndex + 1,
        newNumber: newIndex + 1,
      });
      oldIndex += 1;
      newIndex += 1;
    } else if (table[oldIndex + 1][newIndex] >= table[oldIndex][newIndex + 1]) {
      rows.push({
        kind: "removed",
        text: oldLines[oldIndex],
        oldNumber: oldIndex + 1,
      });
      oldIndex += 1;
    } else {
      rows.push({
        kind: "added",
        text: newLines[newIndex],
        newNumber: newIndex + 1,
      });
      newIndex += 1;
    }
  }

  while (oldIndex < oldLines.length) {
    rows.push({
      kind: "removed",
      text: oldLines[oldIndex],
      oldNumber: oldIndex + 1,
    });
    oldIndex += 1;
  }

  while (newIndex < newLines.length) {
    rows.push({
      kind: "added",
      text: newLines[newIndex],
      newNumber: newIndex + 1,
    });
    newIndex += 1;
  }

  return rows;
}

function normalizeDiffLines(value: string) {
  if (!value) return [""];
  return value.replace(/\r\n/g, "\n").split("\n");
}

function ToolShell({
  title,
  children,
  result,
  error,
}: {
  title: string;
  children: React.ReactNode;
  result: string;
  error?: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
      <pre className={`tool-output mt-4 ${error ? "tool-output-error" : ""}`}>{result}</pre>
    </div>
  );
}

function ToolTextarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      className="tool-input min-h-32 resize-y font-mono text-sm"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
