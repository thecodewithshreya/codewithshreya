"use client";

import { ArrowRight, CalendarDays, CheckCircle2, Circle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { DailyQuestion } from "@/lib/daily-question";

export function DailyQuestionCard({ question }: { question: DailyQuestion }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === question.answer;
  const day = new Date(`${question.date}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

  return (
    <section aria-labelledby="daily-question-title" className="card p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow flex items-center gap-2">
          <CalendarDays size={15} /> Question of the day · {day}
        </p>
        <span className="rounded-full border border-line px-3 py-1 text-xs text-gray-400">{question.quizTitle}</span>
      </div>
      <h2 id="daily-question-title" className="mt-4 text-xl font-bold leading-snug sm:text-2xl">
        {question.question}
      </h2>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {question.options.map((option, index) => {
          const isAnswer = index === question.answer;
          const isSelected = index === selected;
          const state = !answered
            ? "border-line bg-panel/60 text-gray-300 hover:border-violet-400/60"
            : isAnswer
              ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
              : isSelected
                ? "border-rose-500/60 bg-rose-500/10 text-rose-300"
                : "border-line bg-panel/40 text-gray-500";

          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelected(index)}
              disabled={answered}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition disabled:cursor-default ${state}`}
            >
              {answered && isAnswer ? (
                <CheckCircle2 size={17} className="shrink-0" />
              ) : answered && isSelected ? (
                <XCircle size={17} className="shrink-0" />
              ) : (
                <Circle size={17} className="shrink-0" />
              )}
              {option}
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {answered ? (
          <div className="mt-5 rounded-xl border border-line bg-black/10 p-4 text-sm leading-6">
            <p className={`font-semibold ${correct ? "text-emerald-400" : "text-rose-400"}`}>
              {correct ? "Correct!" : `Not quite. The answer is: ${question.options[question.answer]}`}
            </p>
            {question.explanation ? <p className="mt-2 text-gray-400">{question.explanation}</p> : null}
            <Link
              href={`/quizzes/${question.quizSlug}`}
              className="mt-3 inline-flex items-center gap-1 font-medium text-indigo-400 hover:text-indigo-300"
            >
              Practice the full {question.quizTitle} quiz <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">A new question every day. Pick an answer to see the explanation.</p>
        )}
      </div>
    </section>
  );
}
