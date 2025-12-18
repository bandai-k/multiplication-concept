// components/MultiplicationTrainer.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DotGrid from "./DotGrid";

type Question = {
  a: number;
  b: number;
};

const QUESTIONS: Question[] = [
  { a: 2, b: 3 },
  { a: 3, b: 4 },
  { a: 4, b: 2 },
];

export default function MultiplicationTrainer() {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"idle" | "correct" | "wrong">("idle");
  const [hintLevel, setHintLevel] = useState(0);

  const current = QUESTIONS[index];
  const answer = current.a * current.b;

  const shouldShowGrid = result === "wrong" || hintLevel > 0;

  const checkAnswer = () => {
    if (Number(input) === answer) {
      setResult("correct");
    } else {
      setResult("wrong");
    }
  };

  const next = () => {
    setInput("");
    setResult("idle");
    setHintLevel(0);
    setIndex((prev) => (prev + 1) % QUESTIONS.length);
  };

  return (
    <div className="text-center">
      <p className="text-lg mb-4">
        {current.a} が {current.b} こ あります。<br />
        ぜんぶで いくつ？
      </p>

      <AnimatePresence>
        {shouldShowGrid && (
          <motion.div
            key="dotgrid"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mb-6 inline-block"
          >
            <DotGrid cols={current.a} rows={current.b} />
          </motion.div>
        )}
      </AnimatePresence>

      {hintLevel === 2 && (
        <p className="text-sm text-gray-600 mb-2">
          {current.a} + {current.a} + …（{current.b} かい）
        </p>
      )}

      {hintLevel === 3 && (
        <p className="text-sm text-gray-600 mb-2">
          {current.a} × {current.b} = {answer}
        </p>
      )}

      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border rounded px-4 py-2 w-32 text-center mb-4"
      />

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={checkAnswer}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          こたえる
        </button>

        <button
          onClick={() => setHintLevel((h) => Math.min(h + 1, 3))}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          ヒント
        </button>
      </div>

      {result === "correct" && (
        <div>
          <p className="text-green-600 font-bold mb-2">せいかい！</p>
          <button
            onClick={next}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            つぎへ
          </button>
        </div>
      )}

      {result === "wrong" && (
        <p className="text-red-600 mt-2">
          え を だして、かんがえてみよう
        </p>
      )}
    </div>
  );
}
