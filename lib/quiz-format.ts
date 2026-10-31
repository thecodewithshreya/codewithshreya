export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
  source?: string;
};

export const quizTextExample = `Q: Which data structure follows LIFO order?
- Queue
* Stack
- Linked list
- Heap
> The last element pushed is the first one popped.
@ GATE CSE 2019

Q: Next question...`;

const maxQuestions = 100;
const maxOptions = 6;

// Admin quiz text format, one block per question separated by blank lines:
//   Q: question text (following lines without a prefix continue the question)
//   - wrong option
//   * correct option (exactly one)
//   > explanation (optional)
//   @ source, such as "GATE CSE 2019" (optional)
export function parseQuizText(text: string): QuizQuestion[] {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length > maxQuestions) {
    throw new Error(`A quiz can have at most ${maxQuestions} questions.`);
  }

  return blocks.map((block, index) => parseBlock(block, index + 1));
}

export function formatQuizText(questions: QuizQuestion[]) {
  return questions
    .map((item) =>
      [
        `Q: ${item.question}`,
        ...item.options.map((option, index) => `${index === item.answer ? "*" : "-"} ${option}`),
        ...(item.explanation ? [`> ${item.explanation}`] : []),
        ...(item.source ? [`@ ${item.source}`] : []),
      ].join("\n"),
    )
    .join("\n\n");
}

// Reads quiz items stored as JSON, dropping anything malformed.
export function normalizeQuizItems(value: unknown): QuizQuestion[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];

    const { question, options, answer, explanation, source } = item as Record<string, unknown>;

    if (
      typeof question !== "string" ||
      !Array.isArray(options) ||
      !options.every((option) => typeof option === "string") ||
      typeof answer !== "number" ||
      answer < 0 ||
      answer >= options.length
    ) {
      return [];
    }

    return [
      {
        question,
        options,
        answer,
        ...(typeof explanation === "string" && explanation ? { explanation } : {}),
        ...(typeof source === "string" && source ? { source } : {}),
      },
    ];
  });
}

function parseBlock(block: string, number: number): QuizQuestion {
  const questionLines: string[] = [];
  const options: string[] = [];
  const explanationLines: string[] = [];
  let answer = -1;
  let source: string | undefined;
  let section: "question" | "options" | "explanation" = "question";

  for (const rawLine of block.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^q:/i.test(line)) {
      questionLines.push(line.slice(2).trim());
      section = "question";
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      if (line.startsWith("* ")) {
        if (answer !== -1) {
          throw new Error(`Question ${number} has more than one correct option (*).`);
        }
        answer = options.length;
      }
      options.push(line.slice(2).trim().slice(0, 300));
      section = "options";
    } else if (line.startsWith(">")) {
      explanationLines.push(line.slice(1).trim());
      section = "explanation";
    } else if (line.startsWith("@")) {
      source = line.slice(1).trim().slice(0, 80) || undefined;
    } else if (section === "question") {
      questionLines.push(line);
    } else if (section === "explanation") {
      explanationLines.push(line);
    } else {
      throw new Error(`Question ${number}: options must start with "- " or "* ".`);
    }
  }

  const question = questionLines.join(" ").trim().slice(0, 600);
  const explanation = explanationLines.join(" ").trim().slice(0, 1000);

  if (!question) throw new Error(`Question ${number} is missing its "Q:" line.`);
  if (options.length < 2) throw new Error(`Question ${number} needs at least two options.`);
  if (options.length > maxOptions) {
    throw new Error(`Question ${number} can have at most ${maxOptions} options.`);
  }
  if (answer === -1) throw new Error(`Question ${number} needs one correct option marked with "* ".`);

  return {
    question,
    options,
    answer,
    ...(explanation ? { explanation } : {}),
    ...(source ? { source } : {}),
  };
}
