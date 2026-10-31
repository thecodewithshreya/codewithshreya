"use client";

import { ArrowRight, CheckCircle2, Circle, RotateCcw, Trophy, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getQuizBest, saveQuizBest } from "@/lib/progress";
import type { QuizQuestion } from "@/lib/quiz-format";

type QuizPlayerProps = {
  slug: string;
  items: QuizQuestion[];
};

export function QuizPlayer({ slug, items }: QuizPlayerProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => items.map(() => null));
  const [bestScore, setBestScore] = useState<number | null>(null);
  const finished = current >= items.length;
  const score = answers.filter((answer, index) => answer === items[index]?.answer).length;

  useEffect(() => {
    setBestScore(getQuizBest(slug));
  }, [slug]);

  useEffect(() => {
    if (!finished || (bestScore !== null && score <= bestScore)) return;

    setBestScore(score);
    saveQuizBest(slug, score);
  }, [finished, score, bestScore, slug]);

  function choose(optionIndex: number) {
    if (answers[current] !== null) return;
    setAnswers((previous) => previous.map((answer, index) => (index === current ? optionIndex : answer)));
  }

  function restart() {
    setAnswers(items.map(() => null));
    setCurrent(0);
  }

  if (finished) {
    return (
      <QuizResults
        items={items}
        answers={answers}
        score={score}
        bestScore={bestScore}
        onRestart={restart}
      />
    );
  }

  const item = items[current];
  const selected = answers[current];
  const answered = selected !== null;

  return (
    <section className="card p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4 text-sm text-gray-400">
        <span>
          Question {current + 1} of {items.length}
        </span>
        <span>Score {score}</span>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-valuenow={current}
      >
        <div
          className="h-full rounded-full bg-violet-500 transition-all"
          style={{ width: `${(current / items.length) * 100}%` }}
        />
      </div>

      {item.source ? <p className="eyebrow mt-6">{item.source}</p> : null}
      <h2 className={`${item.source ? "mt-2" : "mt-6"} text-xl font-semibold leading-snug`}>{item.question}</h2>

      <div className="mt-5 grid gap-2">
        {item.options.map((option, index) => {
          const isAnswer = index === item.answer;
          const isSelected = index === selected;
          const tone = !answered
            ? "border-line bg-panel/60 text-gray-300 hover:border-violet-500/50"
            : isAnswer
              ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
              : isSelected
                ? "border-rose-500/60 bg-rose-500/10 text-rose-300"
                : "border-line bg-panel/40 text-gray-500";

          return (
            <button
              key={`${index}-${option}`}
              type="button"
              onClick={() => choose(index)}
              disabled={answered}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${tone}`}
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

      {answered ? (
        <div role="status" className="mt-5 rounded-xl border border-line bg-white/[0.03] p-4 text-sm leading-6">
          <p className={`font-semibold ${selected === item.answer ? "text-emerald-400" : "text-rose-400"}`}>
            {selected === item.answer ? "Correct!" : `Not quite. The answer is "${item.options[item.answer]}".`}
          </p>
          {item.explanation ? <p className="mt-1 text-gray-400">{item.explanation}</p> : null}
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="button-primary"
          disabled={!answered}
          onClick={() => setCurrent((value) => value + 1)}
        >
          {current + 1 === items.length ? "See results" : "Next question"}
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

function QuizResults({
  items,
  answers,
  score,
  bestScore,
  onRestart,
}: {
  items: QuizQuestion[];
  answers: (number | null)[];
  score: number;
  bestScore: number | null;
  onRestart: () => void;
}) {
  const percent = Math.round((score / items.length) * 100);
  const message =
    percent >= 80 ? "Excellent work!" : percent >= 50 ? "Good effort. Review the misses below." : "Keep practising. The explanations below will help.";

  return (
    <div className="grid gap-6">
      <section className="card p-6 text-center sm:p-8">
        <Trophy size={36} className="mx-auto text-amber-300" />
        <p className="mt-4 text-4xl font-black">
          {score} / {items.length}
        </p>
        <p className="mt-2 text-gray-400">{message}</p>
        {bestScore !== null ? (
          <p className="mt-1 text-sm text-gray-500">
            Your best: {bestScore} / {items.length}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" className="button-primary" onClick={onRestart}>
            <RotateCcw size={16} />
            Try again
          </button>
          <Link href="/quizzes" className="button-secondary">
            More quizzes
          </Link>
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-bold">Review your answers</h2>
        {items.map((item, index) => {
          const correct = answers[index] === item.answer;
          const chosen = answers[index];

          return (
            <article key={index} className="card p-4 text-sm leading-6">
              <p className="flex items-start gap-2 font-semibold">
                {correct ? (
                  <CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle size={17} className="mt-1 shrink-0 text-rose-400" />
                )}
                <span>
                  {index + 1}. {item.question}
                </span>
              </p>
              {!correct && chosen !== null ? (
                <p className="mt-2 text-rose-300">Your answer: {item.options[chosen]}</p>
              ) : null}
              <p className="mt-1 text-emerald-300">Answer: {item.options[item.answer]}</p>
              {item.explanation ? <p className="mt-1 text-gray-400">{item.explanation}</p> : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
