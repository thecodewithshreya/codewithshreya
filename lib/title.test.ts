import { describe, expect, it } from "vitest";
import { plainTitle, splitTitle } from "@/lib/title";

describe("title helpers", () => {
  it("splits backtick spans into code parts", () => {
    expect(splitTitle("`var` vs `dynamic` in C#")).toEqual([
      { text: "var", code: true },
      { text: " vs ", code: false },
      { text: "dynamic", code: true },
      { text: " in C#", code: false },
    ]);
  });

  it("leaves plain and unbalanced titles alone", () => {
    expect(splitTitle("SQL joins")).toEqual([{ text: "SQL joins", code: false }]);
    expect(splitTitle("Use ` carefully")).toEqual([{ text: "Use ` carefully", code: false }]);
    expect(plainTitle("Use ` carefully")).toBe("Use ` carefully");
  });

  it("strips the backticks for plain text", () => {
    expect(plainTitle("`var` vs `dynamic` in C#")).toBe("var vs dynamic in C#");
  });
});
