import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputDir = join(process.cwd(), "public", "blog", "csharp-basics");
mkdirSync(outputDir, { recursive: true });

const visuals = [
  {
    file: "value-types-reference-types.svg",
    title: "Value Types vs Reference Types",
    subtitle: "Ask what gets copied: the value itself or a reference to an object.",
    accent: "#38bdf8",
    nodes: [
      { label: "int a", detail: "10" },
      { label: "copy", detail: "value" },
      { label: "int b", detail: "20" },
      { label: "Student first", detail: "reference" },
      { label: "same object", detail: "Name = Aman" },
      { label: "Student second", detail: "reference" },
    ],
    code: "int b = a;  // separate value\nsecond = first;  // same object",
  },
  {
    file: "boxing-unboxing.svg",
    title: "Boxing and Unboxing",
    subtitle: "Boxing wraps a value type as object. Unboxing extracts it back.",
    accent: "#f59e0b",
    nodes: [
      { label: "int", detail: "101" },
      { label: "boxing", detail: "wrap" },
      { label: "object", detail: "boxed 101" },
      { label: "unboxing", detail: "cast" },
      { label: "int", detail: "101" },
    ],
    code: "object boxed = 101;\nint value = (int)boxed;",
  },
  {
    file: "var-dynamic-object.svg",
    title: "var vs dynamic vs object",
    subtitle: "The difference is when C# knows what operations are valid.",
    accent: "#a78bfa",
    nodes: [
      { label: "var", detail: "compile-time inferred type" },
      { label: "object", detail: "compile-time Object type" },
      { label: "dynamic", detail: "runtime binding" },
    ],
    code: "var name = \"C#\";\nobject title = \"C#\";\ndynamic value = \"C#\";",
  },
  {
    file: "const-readonly.svg",
    title: "const vs readonly",
    subtitle: "const is fixed at compile time. readonly can be assigned at runtime in a constructor.",
    accent: "#22c55e",
    nodes: [
      { label: "const", detail: "compile-time constant" },
      { label: "readonly", detail: "constructor-time value" },
      { label: "static readonly", detail: "runtime shared value" },
    ],
    code: "const decimal TaxRate = 0.18m;\nreadonly DateTime CreatedAt;",
  },
  {
    file: "nullable-types.svg",
    title: "Nullable Types",
    subtitle: "Use nullable types when missing data is a valid state.",
    accent: "#06b6d4",
    nodes: [
      { label: "int", detail: "must have a number" },
      { label: "int?", detail: "number or null" },
      { label: "string?", detail: "maybe null reference" },
    ],
    code: "int? marks = null;\nstring? middleName = null;",
  },
  {
    file: "equality.svg",
    title: "== vs .Equals()",
    subtitle: "Equality depends on the type and whether equality behavior was defined.",
    accent: "#ec4899",
    nodes: [
      { label: "int", detail: "value comparison" },
      { label: "class", detail: "reference comparison by default" },
      { label: "string", detail: "text comparison" },
      { label: "record", detail: "data comparison" },
    ],
    code: "student1 == student2\nstudent1.Equals(student2)",
  },
  {
    file: "ref-out-in.svg",
    title: "ref, out, and in Parameters",
    subtitle: "These modifiers control whether a method can read or assign the caller's variable.",
    accent: "#14b8a6",
    nodes: [
      { label: "ref", detail: "read and assign" },
      { label: "out", detail: "must assign before return" },
      { label: "in", detail: "read-only reference" },
    ],
    code: "ApplyDiscount(ref fee);\nTryParse(input, out marks);\nPrintFee(in fee);",
  },
  {
    file: "method-overloading.svg",
    title: "Method Overloading",
    subtitle: "Same method name, different parameter lists. Chosen at compile time.",
    accent: "#60a5fa",
    nodes: [
      { label: "Enroll(name)", detail: "one parameter" },
      { label: "Enroll(name, id)", detail: "two parameters" },
      { label: "compiler", detail: "selects overload" },
    ],
    code: "void Enroll(string name)\nvoid Enroll(string name, int courseId)",
  },
  {
    file: "method-overriding.svg",
    title: "Method Overriding",
    subtitle: "A derived class replaces virtual behavior from a base class.",
    accent: "#f97316",
    nodes: [
      { label: "Course", detail: "virtual CalculateFee()" },
      { label: "DiscountedCourse", detail: "override CalculateFee()" },
      { label: "runtime", detail: "uses actual object" },
    ],
    code: "Course c = new DiscountedCourse();\nc.CalculateFee();",
  },
  {
    file: "virtual-override-new.svg",
    title: "virtual, override, and new",
    subtitle: "override replaces polymorphic behavior. new hides an inherited member.",
    accent: "#818cf8",
    nodes: [
      { label: "virtual", detail: "can be overridden" },
      { label: "override", detail: "polymorphic replacement" },
      { label: "new", detail: "member hiding" },
    ],
    code: "public virtual string Title()\npublic override string Title()\npublic new string Title()",
  },
  {
    file: "extension-methods.svg",
    title: "Extension Methods",
    subtitle: "A static helper can be called like an instance method.",
    accent: "#34d399",
    nodes: [
      { label: "static class", detail: "CourseExtensions" },
      { label: "this Course", detail: "target type" },
      { label: "course.IsFree()", detail: "call style" },
    ],
    code: "public static bool IsFree(this Course course)",
  },
  {
    file: "partial-classes.svg",
    title: "Partial Classes",
    subtitle: "One class can be split across files and combined at compile time.",
    accent: "#22d3ee",
    nodes: [
      { label: "Student.Profile.cs", detail: "Name property" },
      { label: "Student.Enrollment.cs", detail: "CourseId property" },
      { label: "compiler", detail: "one Student class" },
    ],
    code: "public partial class Student { }",
  },
  {
    file: "anonymous-types.svg",
    title: "Anonymous Types",
    subtitle: "Create local read-only object shapes without naming a class.",
    accent: "#c084fc",
    nodes: [
      { label: "new { }", detail: "temporary shape" },
      { label: "LINQ projection", detail: "select fields" },
      { label: "local use", detail: "not domain model" },
    ],
    code: "var summary = new { Name = \"Asha\", Paid = true };",
  },
  {
    file: "sealed-class.svg",
    title: "Sealed Class",
    subtitle: "A sealed class cannot be inherited.",
    accent: "#fb7185",
    nodes: [
      { label: "CertificateGenerator", detail: "sealed" },
      { label: "inheritance", detail: "blocked" },
      { label: "intent", detail: "type is complete" },
    ],
    code: "public sealed class CertificateGenerator { }",
  },
  {
    file: "static-class.svg",
    title: "Static Class",
    subtitle: "A static class cannot be instantiated and contains only static members.",
    accent: "#facc15",
    nodes: [
      { label: "FeeCalculator", detail: "static class" },
      { label: "AddTax()", detail: "static method" },
      { label: "no object", detail: "call by class name" },
    ],
    code: "FeeCalculator.AddTax(5000);",
  },
  {
    file: "static-inheritance.svg",
    title: "Can a Static Class Be Inherited?",
    subtitle: "No. Static classes are not part of an inheritance hierarchy.",
    accent: "#f43f5e",
    nodes: [
      { label: "static class", detail: "abstract + sealed idea" },
      { label: "inherit", detail: "not allowed" },
      { label: "use", detail: "helpers and extensions" },
    ],
    code: "public static class Helpers { }\n// cannot inherit from Helpers",
  },
  {
    file: "string-stringbuilder-span.svg",
    title: "String, StringBuilder, Span<char>",
    subtitle: "Choose based on normal text, repeated building, or allocation-sensitive slicing.",
    accent: "#2dd4bf",
    nodes: [
      { label: "string", detail: "immutable text" },
      { label: "StringBuilder", detail: "repeated text building" },
      { label: "Span<char>", detail: "view over characters" },
    ],
    code: "string title\nvar builder = new StringBuilder()\nSpan<char> buffer",
  },
  {
    file: "string-immutability.svg",
    title: "Why Strings Are Immutable",
    subtitle: "Changing text creates a new string object, which makes sharing safer.",
    accent: "#38bdf8",
    nodes: [
      { label: "\"C#\"", detail: "original string" },
      { label: "+ \" Basics\"", detail: "operation" },
      { label: "\"C# Basics\"", detail: "new string" },
    ],
    code: "title += \" Basics\";  // new string",
  },
  {
    file: "pattern-matching.svg",
    title: "Pattern Matching",
    subtitle: "Test shape, type, constants, ranges, or properties in readable conditions.",
    accent: "#a3e635",
    nodes: [
      { label: "input", detail: "object" },
      { label: "is string title", detail: "type pattern" },
      { label: "switch", detail: "range and constant patterns" },
    ],
    code: "input is string title\nfee switch { 0 => \"Free\", > 0 => \"Paid\" }",
  },
  {
    file: "records.svg",
    title: "Records",
    subtitle: "Records are data-focused types with value equality and with-expressions.",
    accent: "#8b5cf6",
    nodes: [
      { label: "record", detail: "CourseSummary" },
      { label: "==", detail: "data equality" },
      { label: "with", detail: "copy with changes" },
    ],
    code: "var discounted = first with { Fee = 4000 };",
  },
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function textLines(value, maxLength = 30) {
  const words = value.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function nodeCard(node, index, total, accent) {
  const columns = total <= 3 ? total : Math.ceil(total / 2);
  const cardWidth = total <= 3 ? 300 : 245;
  const gap = total <= 3 ? 50 : 34;
  const startX = (1200 - columns * cardWidth - (columns - 1) * gap) / 2;
  const row = total <= 3 ? 0 : Math.floor(index / columns);
  const col = total <= 3 ? index : index % columns;
  const x = startX + col * (cardWidth + gap);
  const y = total <= 3 ? 220 : 190 + row * 132;
  const detailLines = textLines(node.detail, 24);

  return `
    <g>
      <rect x="${x}" y="${y}" width="${cardWidth}" height="112" rx="20" fill="#0f172a" stroke="${accent}" stroke-opacity="0.72"/>
      <circle cx="${x + 30}" cy="${y + 32}" r="10" fill="${accent}"/>
      <text x="${x + 52}" y="${y + 39}" fill="#f8fafc" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="22" font-weight="750">${escapeHtml(node.label)}</text>
      ${detailLines
        .map(
          (line, lineIndex) =>
            `<text x="${x + 30}" y="${y + 76 + lineIndex * 24}" fill="#cbd5e1" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="17">${escapeHtml(line)}</text>`,
        )
        .join("")}
    </g>`;
}

function arrows(total) {
  if (total > 3) return "";
  const startX = (1200 - total * 300 - (total - 1) * 50) / 2;
  return Array.from({ length: total - 1 }, (_, index) => {
    const x1 = startX + index * 350 + 300;
    const x2 = x1 + 44;
    return `<path d="M${x1} 276 H${x2}" stroke="#94a3b8" stroke-width="3" marker-end="url(#arrow)"/>`;
  }).join("");
}

function renderVisual(visual) {
  const codeLine = visual.code.split("\n")[0];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520" viewBox="0 0 1200 520" role="img" aria-labelledby="title desc">
  <title id="title">${escapeHtml(visual.title)}</title>
  <desc id="desc">${escapeHtml(visual.subtitle)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#07111f"/>
      <stop offset="0.58" stop-color="#111827"/>
      <stop offset="1" stop-color="#061b1f"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
      <path d="M2 2 L10 6 L2 10 Z" fill="#94a3b8"/>
    </marker>
  </defs>
  <rect width="1200" height="520" fill="url(#bg)"/>
  <circle cx="1060" cy="80" r="150" fill="${visual.accent}" opacity="0.08"/>
  <circle cx="120" cy="470" r="170" fill="${visual.accent}" opacity="0.055"/>
  <g filter="url(#shadow)">
    <rect x="52" y="48" width="1096" height="424" rx="28" fill="#020617" fill-opacity="0.72" stroke="#1f2a44"/>
    <text x="90" y="106" fill="#f8fafc" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="38" font-weight="800">${escapeHtml(visual.title)}</text>
    ${textLines(visual.subtitle, 86)
      .map(
        (line, index) =>
          `<text x="90" y="${144 + index * 26}" fill="#cbd5e1" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="18">${escapeHtml(line)}</text>`,
      )
      .join("")}
    ${arrows(visual.nodes.length)}
    ${visual.nodes.map((node, index) => nodeCard(node, index, visual.nodes.length, visual.accent)).join("")}
    <rect x="90" y="448" width="1020" height="44" rx="16" fill="#0b1220" stroke="#24324c"/>
    <text x="116" y="477" fill="${visual.accent}" font-family="Consolas, Menlo, monospace" font-size="21">${escapeHtml(codeLine)}</text>
  </g>
</svg>
`;
}

for (const visual of visuals) {
  writeFileSync(join(outputDir, visual.file), renderVisual(visual), "utf8");
}

console.log(`Generated ${visuals.length} C# visual examples.`);
