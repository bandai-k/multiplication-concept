// components/MultiplicationTrainer.tsx
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EmojiBags from "./EmojiBags";
import DotGrid from "./DotGrid";

type Phase = "select" | "learning" | "finished";
type Result = "idle" | "correct" | "wrong";

type Question = { a: number; b: number };

export type StepId = "A" | "B" | "C" | "D";

type Step = {
  id: StepId;
  label: string;

  itemLabel: string;
  itemEmoji: string;

  containerLabel: string;
  containerCounter: string;

  aMin: number;
  aMax: number;
  bMin: number;
  bMax: number;

  count: number;
};

const STEPS: Step[] = [
  {
    id: "A",
    label: "ステップA：あめ（ふくろ）",
    itemLabel: "あめ",
    itemEmoji: "🍬",
    containerLabel: "ふくろ",
    containerCounter: "ふくろ",
    aMin: 2,
    aMax: 4,
    bMin: 2,
    bMax: 4,
    count: 8,
  },
  {
    id: "B",
    label: "ステップB：いちご（おさら）",
    itemLabel: "いちご",
    itemEmoji: "🍓",
    containerLabel: "おさら",
    containerCounter: "まい",
    aMin: 2,
    aMax: 5,
    bMin: 2,
    bMax: 6,
    count: 8,
  },
  {
    id: "C",
    label: "ステップC：6の段以上",
    itemLabel: "クッキー",
    itemEmoji: "🍪",
    containerLabel: "はこ",
    containerCounter: "こ",
    aMin: 6,
    aMax: 9,
    bMin: 2,
    bMax: 5,
    count: 8,
  },
  {
    id: "D",
    label: "ステップD：6の段以上",
    itemLabel: "ボール",
    itemEmoji: "⚽",
    containerLabel: "かご",
    containerCounter: "こ",
    aMin: 6,
    aMax: 9,
    bMin: 6,
    bMax: 9,
    count: 8,
  },
];

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateQuestions = (step: Step): Question[] => {
  const set = new Set<string>();
  const out: Question[] = [];
  const maxAttempts = 2000;
  let attempts = 0;

  while (out.length < step.count && attempts < maxAttempts) {
    attempts++;
    const a = randInt(step.aMin, step.aMax);
    const b = randInt(step.bMin, step.bMax);
    const key = `${a}x${b}`;
    if (set.has(key)) continue;
    set.add(key);
    out.push({ a, b });
  }

  return out.slice(0, step.count);
};

type Props = {
  /** 外部メニューから直接開始したい場合 */
  initialStep?: StepId;
  /** 外部へ戻る（learnメニューへ戻す等） */
  onExit?: () => void;
};

export default function MultiplicationTrainer({ initialStep, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>("select");
  const [stepId, setStepId] = useState<StepId>("A");

  const step = useMemo(
    () => STEPS.find((s) => s.id === stepId) ?? STEPS[0],
    [stepId]
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);

  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result>("idle");
  const [hintLevel, setHintLevel] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const startStep = (id: StepId) => {
    const s = STEPS.find((x) => x.id === id) ?? STEPS[0];
    setStepId(s.id);
    setQuestions(generateQuestions(s));
    setIndex(0);

    setInput("");
    setResult("idle");
    setHintLevel(0);

    setCorrectCount(0);
    setWrongCount(0);

    setPhase("learning");
  };

  // ✅ 外部から initialStep が渡されたら、select をスキップして開始
  useEffect(() => {
    if (!initialStep) return;

    // すでに学習中/終了なら上書きしない（意図せずリセットされるのを防ぐ）
    if (phase !== "select") return;

    startStep(initialStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStep, phase]);

  const resetForNext = () => {
    setInput("");
    setResult("idle");
    setHintLevel(0);
  };

  const current = questions[index];
  const answer = current ? current.a * current.b : 0;

  const shouldShowDotGrid =
    hintLevel > 0 || result === "wrong" || result === "correct";

  const submit = () => {
    if (!current) return;
    const n = Number(input);
    if (!Number.isFinite(n)) return;

    if (n === answer) {
      setCorrectCount((v) => v + 1);
      setResult("correct");
    } else {
      setWrongCount((v) => v + 1);
      setResult("wrong");
    }
  };

  const next = () => {
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) {
      setPhase("finished");
      return;
    }
    setIndex(nextIndex);
    resetForNext();
  };

  const hintUp = () => setHintLevel((lv) => Math.min(lv + 1, 3));

  // ✅ “戻る” の挙動（外部メニューがある場合は onExit を優先）
  const goBackToMenu = () => {
    if (onExit) onExit();
    else setPhase("select");
  };

  // -------------------------
  // select（ステップ選択）
  // -------------------------
  if (phase === "select") {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white border rounded-2xl shadow p-6 text-center"
      >
        <h2 className="text-2xl font-bold mb-3">どれで かんがえる？</h2>
        <p className="text-sm text-gray-600 mb-6">
          まずは え を みて、<br />
          「おなじ かずの まとまり」が いくつあるか を かんがえよう
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => startStep(s.id)}
              className="px-6 py-3 rounded-xl border hover:bg-gray-50 transition text-left"
            >
              <div className="font-semibold">{s.label}</div>
              <div className="text-xs text-gray-500 mt-1">
                {s.itemEmoji} {s.itemLabel} / {s.containerLabel}
              </div>
            </button>
          ))}
        </div>

        {/* 外側メニュー運用の場合の戻る */}
        {onExit && (
          <div className="mt-6">
            <button
              onClick={onExit}
              className="text-sm underline opacity-70 hover:opacity-100 transition"
            >
              ← もどる
            </button>
          </div>
        )}
      </motion.section>
    );
  }

  // -------------------------
  // finished（終了）
  // -------------------------
  if (phase === "finished") {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white border rounded-2xl shadow p-6 text-center"
      >
        <p className="text-sm text-gray-500 mb-2">きょうは ここまで</p>
        <h2 className="text-3xl font-extrabold mb-4">よく がんばったね 🌱</h2>

        <p className="text-gray-700 mb-6 leading-relaxed">
          きょうのステップ：<span className="font-semibold">{step.label}</span>
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <div className="p-4 bg-gray-50 rounded-xl border">
            <p className="text-xs text-gray-500 mb-1">せいかい</p>
            <p className="text-2xl font-bold">{correctCount}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border">
            <p className="text-xs text-gray-500 mb-1">まちがい</p>
            <p className="text-2xl font-bold">{wrongCount}</p>
          </div>
        </div>

        <div className="bg-gray-50 border rounded-xl p-4 text-sm text-gray-700 mb-6">
          <p className="font-semibold mb-2">おうちの人へ</p>
          <p>
            「◯つ入った まとまりが △こ」を、絵で確認できています。
            <br />
            次は、ヒントを減らしても答えられるか試してみてください。
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            className="px-8 py-3 rounded-xl bg-black text-white hover:opacity-90 transition"
            onClick={() => startStep(stepId)}
          >
            もういちど（このステップ）
          </button>

          <button
            className="px-8 py-3 rounded-xl border hover:bg-gray-50 transition"
            onClick={goBackToMenu}
          >
            もどる
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">※ 点数やランキングはありません</p>
      </motion.section>
    );
  }

  // -------------------------
  // learning（没入：問題だけ）
  // -------------------------
  if (!current) return null;

  const problemText = `${step.itemLabel}が ${current.a}つ入った ${step.containerLabel}が ${current.b}${step.containerCounter}あります。${step.itemLabel}は ぜんぶで なんこありますか？`;

  return (
    <section className="bg-white border rounded-2xl shadow p-6">
      {/* 上部：戻る（外部メニューがあるなら戻す） */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goBackToMenu}
          className="text-sm underline opacity-70 hover:opacity-100 transition"
        >
          ← もどる
        </button>
        <p className="text-xs text-gray-500">{step.label}</p>
      </div>

      {/* 問題文 */}
      <div className="text-center text-gray-900 text-lg leading-relaxed mb-5">
        <p>{problemText}</p>
      </div>

      {/* 生活イメージ */}
      <div className="mb-6">
        <EmojiBags
          itemEmoji={step.itemEmoji}
          perContainer={current.a}
          containerCount={current.b}
          containerLabel={step.containerLabel}
        />
      </div>

      {/* DotGrid */}
      <AnimatePresence>
        {shouldShowDotGrid && (
          <motion.div
            key={`dotgrid-${index}-${hintLevel}-${result}`}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.99 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mb-5 flex justify-center"
          >
            <DotGrid cols={current.a} rows={current.b} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ヒント段階 */}
      {hintLevel >= 2 && (
        <p className="text-center text-sm text-gray-600 mb-2">
          {Array.from({ length: current.b })
            .map(() => `${current.a}`)
            .join(" + ")}
        </p>
      )}
      {hintLevel >= 3 && (
        <p className="text-center text-sm text-gray-600 mb-4">
          {current.a} × {current.b} = {answer}
        </p>
      )}

      <div className="flex flex-col items-center gap-3">
        {result !== "correct" && (
          <>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/[^\d]/g, ""))}
              className="w-40 border rounded-xl px-4 py-3 text-2xl text-center"
              aria-label="こたえ"
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />

            <button
              className="px-10 py-3 rounded-xl bg-lime-600 text-white hover:bg-lime-700 transition disabled:opacity-50"
              onClick={submit}
              disabled={input.length === 0}
            >
              こたえる
            </button>
          </>
        )}

        {result === "wrong" && (
          <div className="text-center space-y-1">
            <p className="text-lg font-bold text-gray-900">△ もういちど</p>
            <p className="text-sm text-gray-600">
              え を みて、まとまりを かぞえてみよう
            </p>
          </div>
        )}

        {result === "correct" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="text-center"
          >
            <p className="text-3xl font-extrabold text-lime-700 mb-2">
              ⭕ せいかい！
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {current.a} × {current.b} = {answer}
            </p>

            <button
              className="px-10 py-3 rounded-xl bg-black text-white hover:opacity-90 transition"
              onClick={next}
            >
              つぎへ
            </button>
          </motion.div>
        )}

        {result !== "correct" && (
          <button
            className="text-sm underline opacity-70 hover:opacity-100 transition disabled:opacity-40"
            onClick={() => hintUp()}
            disabled={hintLevel >= 3}
          >
            ヒント{hintLevel > 0 ? `（${hintLevel}/3）` : ""}
          </button>
        )}
      </div>
    </section>
  );
}
