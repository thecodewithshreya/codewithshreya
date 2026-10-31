import { describe, expect, it } from "vitest";
import { indentEdit, newlineEdit, type TextEdit } from "@/lib/code-editing";

function apply(value: string, edit: TextEdit | null) {
  if (!edit) return { value, selection: null };
  const next = value.slice(0, edit.start) + edit.text + value.slice(edit.end);
  return { value: next, selection: [edit.selectionStart, edit.selectionEnd] };
}

describe("indentEdit", () => {
  it("inserts one indent at the cursor", () => {
    expect(apply("ab", indentEdit("ab", 1, 1, "    "))).toEqual({ value: "a    b", selection: [5, 5] });
  });

  it("indents every selected line and keeps them selected", () => {
    const value = "if x:\nprint(1)\nprint(2)\nend";
    const start = value.indexOf("print(1)") + 2;
    const end = value.indexOf("print(2)") + 3;
    const result = apply(value, indentEdit(value, start, end, "  "));

    expect(result.value).toBe("if x:\n  print(1)\n  print(2)\nend");
    expect(result.value.slice(result.selection![0], result.selection![1])).toBe("int(1)\n  pri");
  });

  it("does not indent the line after a selection that ends on a newline", () => {
    const value = "a\nb\nc";
    expect(apply(value, indentEdit(value, 0, 4, "  ")).value).toBe("  a\n  b\nc");
  });

  it("outdents by at most one level and never past the line start", () => {
    const value = "      x\n y\nz";
    const result = apply(value, indentEdit(value, 7, value.length, "    ", true));

    expect(result.value).toBe("  x\ny\nz");
    expect(result.selection![0]).toBe(3);
  });

  it("returns null when there is nothing to outdent", () => {
    expect(indentEdit("x", 0, 0, "  ", true)).toBeNull();
  });
});

describe("newlineEdit", () => {
  it("keeps the current indentation", () => {
    expect(apply("    x = 1", newlineEdit("    x = 1", 9, 9, "    ")).value).toBe("    x = 1\n    ");
  });

  it("indents one level after a block opener", () => {
    expect(apply("def f():", newlineEdit("def f():", 8, 8, "    ")).value).toBe("def f():\n    ");
    expect(apply("  if (a) {", newlineEdit("  if (a) {", 10, 10, "  ")).value).toBe("  if (a) {\n    ");
  });
});
