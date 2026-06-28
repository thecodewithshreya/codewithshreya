"use client";

import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { useState } from "react";

type ArticleQuizProps = {
  question: string;
  options: string[];
  answer: string;
};

export function ArticleQuiz({ question, options, answer }: ArticleQuizProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const isCorrect = selected === answer;

  return (
    <section className="my-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.06] p-5 sm:p-6">
      <p className="eyebrow">Quick check</p>
      <h2 className="mt-2 text-lg font-semibold">{question}</h2>
      <div className="mt-4 grid gap-2">
        {options.map((option) => {
          const isSelected = selected === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelected(option)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                isSelected
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                  : "border-line bg-panel/60 text-gray-300 hover:border-indigo-500/50"
              }`}
            >
              {isSelected ? <CheckCircle2 size={17} /> : <Circle size={17} />}
              {option}
            </button>
          );
        })}
      </div>
      {selected && (
        <p
          role="status"
          className={`mt-4 flex items-center gap-2 text-sm font-medium ${
            isCorrect ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {isCorrect ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
          {isCorrect ? "Correct — you have got it." : `Not quite. The answer is ${answer}.`}
        </p>
      )}
    </section>
  );
}
