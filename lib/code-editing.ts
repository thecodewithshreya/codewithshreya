// Plain-textarea editing helpers for the compiler. Each returns the range to
// replace and the new selection, so the caller can apply it as one undoable edit.

export type TextEdit = {
  start: number;
  end: number;
  text: string;
  selectionStart: number;
  selectionEnd: number;
};

function lineStart(value: string, index: number) {
  return value.lastIndexOf("\n", index - 1) + 1;
}

// Tab: insert an indent, or indent every selected line. Shift+Tab: outdent the lines.
export function indentEdit(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  unit: string,
  outdent = false,
): TextEdit | null {
  const multiLine = value.slice(selectionStart, selectionEnd).includes("\n");

  if (!outdent && !multiLine) {
    return {
      start: selectionStart,
      end: selectionEnd,
      text: unit,
      selectionStart: selectionStart + unit.length,
      selectionEnd: selectionStart + unit.length,
    };
  }

  const start = lineStart(value, selectionStart);
  // A selection ending at the start of a line does not include that line.
  const lastIndex = selectionEnd > selectionStart && value[selectionEnd - 1] === "\n" ? selectionEnd - 1 : selectionEnd;
  const lineEnd = value.indexOf("\n", lastIndex);
  const end = lineEnd === -1 ? value.length : lineEnd;
  const lines = value.slice(start, end).split("\n");

  const removed: number[] = [];
  const changed = lines.map((line) => {
    if (!outdent) return unit + line;
    const leading = /^[ \t]*/.exec(line)![0];
    const count = leading.startsWith("\t") ? 1 : Math.min(leading.length, unit.length);
    removed.push(count);
    return line.slice(count);
  });

  const text = changed.join("\n");
  if (text === value.slice(start, end)) return null;

  const firstShift = outdent ? -Math.min(removed[0], selectionStart - start) : unit.length;
  return {
    start,
    end,
    text,
    selectionStart: Math.max(start, selectionStart + firstShift),
    selectionEnd: selectionEnd + (text.length - (end - start)),
  };
}

// Enter: keep the current line's indentation, one level deeper after ":" "{" "[" or "(".
export function newlineEdit(value: string, selectionStart: number, selectionEnd: number, unit: string): TextEdit {
  const line = value.slice(lineStart(value, selectionStart), selectionStart);
  const indent = /^[ \t]*/.exec(line)![0];
  const opens = /[:{[(]\s*$/.test(line);
  const text = `\n${indent}${opens ? unit : ""}`;

  return {
    start: selectionStart,
    end: selectionEnd,
    text,
    selectionStart: selectionStart + text.length,
    selectionEnd: selectionStart + text.length,
  };
}
