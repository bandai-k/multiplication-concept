// components/kuku/KukuByShape.tsx
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "menu" | "fill" | "done";
type Result = "idle" | "correct" | "wrong";

type Props = {
    onExit?: () => void;
    minDan?: number; // default 2
    maxDan?: number; // default 9
};

type FillType = "LAST_DIGIT" | "MISSING_A" | "MINI_TABLE";

const range = (min: number, max: number) =>
    Array.from({ length: max - min + 1 }, (_, i) => min + i);

const randPick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export default function KukuByShape({
    onExit,
    minDan = 2,
    maxDan = 9,
}: Props) {
    const [phase, setPhase] = useState<Phase>("menu");
    const [dan, setDan] = useState<number>(6);
    const [count, setCount] = useState(0);
    const [result, setResult] = useState<Result>("idle");
    const [input, setInput] = useState("");

    const [fillType, setFillType] = useState<FillType>("LAST_DIGIT");
    const [a, setA] = useState(6);
    const [b, setB] = useState(7);

    const answer = a * b;

    const nextQuestion = () => {
        const t = randPick<FillType>(["LAST_DIGIT", "MISSING_A", "MINI_TABLE"]);
        setFillType(t);

        // 基本は「選んだ段」を軸にする（視覚のフック）
        const newA = dan;
        const newB = randInt(2, 9);

        setA(newA);
        setB(newB);

        setInput("");
        setResult("idle");
    };

    const start = () => {
        setCount(0);
        nextQuestion();
        setPhase("fill");
    };

    const submit = () => {
        // MINI_TABLE は別の入力判定（ここでは簡易：中央穴だけ）
        if (fillType === "MINI_TABLE") {
            const n = Number(input);
            if (!Number.isFinite(n)) return;
            // MINI_TABLEの穴は中央（dan×b）
            if (n === answer) setResult("correct");
            else setResult("wrong");
            return;
        }

        const n = Number(input);
        if (!Number.isFinite(n)) return;

        if (fillType === "LAST_DIGIT") {
            // 最後の1桁だけ当てる（例：42 → 2）
            if (n === answer % 10) setResult("correct");
            else setResult("wrong");
            return;
        }

        if (fillType === "MISSING_A") {
            // □ × b = answer → □ を当てる（= a）
            if (n === a) setResult("correct");
            else setResult("wrong");
            return;
        }
    };

    const next = () => {
        const nextCount = count + 1;
        if (nextCount >= 8) {
            setPhase("done");
            return;
        }
        setCount(nextCount);
        nextQuestion();
    };

    // MINI_TABLE用データ（3×3）
    const tableCols = useMemo(() => [dan, dan + 1, dan + 2], [dan]);
    const tableRows = useMemo(() => [2, 3, 4], []); // MVPは2〜4固定で軽く

    const holeCell = useMemo(() => {
        // 穴は中央（row=3, col=dan+1）に固定（覚えやすい）
        return { col: dan + 1, row: 3 };
    }, [dan]);

    // MINI_TABLE時は a,b を「中央穴」に合わせる
    const miniTableA = dan + 1;
    const miniTableB = 3;
    const miniTableAns = miniTableA * miniTableB;

    const showPrompt = () => {
        if (fillType === "LAST_DIGIT") {
            const tens = Math.floor(answer / 10);
            return (
                <div className="text-center space-y-2">
                    <p className="text-xs text-gray-500">穴埋め①：さいごの1けた</p>
                    <p className="text-3xl font-extrabold text-gray-900">
                        {a} × {b} = {tens}□
                    </p>
                    <p className="text-sm text-gray-600">□に入る すうじは？</p>
                </div>
            );
        }

        if (fillType === "MISSING_A") {
            return (
                <div className="text-center space-y-2">
                    <p className="text-xs text-gray-500">穴埋め②：どれ×？</p>
                    <p className="text-3xl font-extrabold text-gray-900">
                        □ × {b} = {answer}
                    </p>
                    <p className="text-sm text-gray-600">□に入る すうじは？</p>
                </div>
            );
        }

        // MINI_TABLE
        return (
            <div className="space-y-3">
                <p className="text-xs text-gray-500 text-center">穴埋め③：九九表（ミニ）</p>

                <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr>
                                <th className="border p-2 bg-gray-50 text-xs text-gray-600">×</th>
                                {tableCols.map((c) => (
                                    <th key={c} className="border p-2 bg-gray-50 font-semibold">
                                        {c}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.map((r) => (
                                <tr key={r}>
                                    <td className="border p-2 bg-gray-50 font-semibold">{r}</td>
                                    {tableCols.map((c) => {
                                        const isHole = c === holeCell.col && r === holeCell.row;
                                        const val = c * r;
                                        return (
                                            <td key={`${c}-${r}`} className="border p-2">
                                                {isHole ? (
                                                    <span className="inline-block px-3 py-1 rounded bg-yellow-100 font-bold">
                                                        □
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-700">{val}</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p className="text-sm text-gray-600 text-center">
                    □に入る すうじを入れてね（まんなか）
                </p>
            </div>
        );
    };

    // 入力の正解値
    const expected = useMemo(() => {
        if (fillType === "LAST_DIGIT") return answer % 10;
        if (fillType === "MISSING_A") return a;
        return miniTableAns;
    }, [fillType, answer, a, miniTableAns]);

    const resetToMenu = () => {
        setPhase("menu");
        setCount(0);
        setResult("idle");
        setInput("");
    };

    return (
        <section className="bg-white border rounded-2xl shadow p-6">
            <AnimatePresence mode="wait">
                {phase === "menu" && (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="text-center"
                    >
                        <p className="text-xs text-gray-500 mb-2">九九｜形でおぼえる（穴埋め）</p>
                        <h2 className="text-2xl font-bold mb-2">どの段を 形でおぼえる？</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            “思い出す”練習。文章問題は出しません。
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {range(minDan, maxDan).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDan(d)}
                                    className={`px-4 py-2 rounded-xl border transition ${d === dan ? "bg-black text-white" : "hover:bg-gray-50"
                                        }`}
                                >
                                    {d}のだん
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3 max-w-xs mx-auto">
                            <button
                                onClick={start}
                                className="px-8 py-3 rounded-xl bg-lime-600 text-white hover:bg-lime-700 transition"
                            >
                                はじめる（8もん）
                            </button>

                            {onExit && (
                                <button
                                    onClick={onExit}
                                    className="text-sm underline opacity-70 hover:opacity-100 transition mt-2"
                                >
                                    ← もどる
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {phase === "fill" && (
                    <motion.div
                        key="fill"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                    >
                        <div className="flex justify-between items-center">
                            <button
                                onClick={resetToMenu}
                                className="text-sm underline opacity-70 hover:opacity-100 transition"
                            >
                                ← 段をえらびなおす
                            </button>
                            <p className="text-xs text-gray-500">
                                {dan}のだん / {count + 1} / 8
                            </p>
                        </div>

                        {showPrompt()}

                        <div className="flex flex-col items-center gap-3">
                            {result !== "correct" && (
                                <>
                                    <input
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value.replace(/[^\d]/g, ""))
                                        }
                                        className="w-40 border rounded-xl px-4 py-3 text-2xl text-center"
                                        aria-label="こたえ"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") submit();
                                        }}
                                    />

                                    <button
                                        onClick={submit}
                                        disabled={input.length === 0}
                                        className="px-10 py-3 rounded-xl bg-lime-600 text-white hover:bg-lime-700 transition disabled:opacity-50"
                                    >
                                        こたえる
                                    </button>
                                </>
                            )}

                            {result === "wrong" && (
                                <div className="text-center space-y-1">
                                    <p className="text-lg font-bold text-gray-900">△ ちがう</p>
                                    <p className="text-sm text-gray-600">
                                        こたえ：{expected}
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
                                    <button
                                        onClick={next}
                                        className="px-10 py-3 rounded-xl bg-black text-white hover:opacity-90 transition"
                                    >
                                        つぎへ
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}

                {phase === "done" && (
                    <motion.div
                        key="done"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-center space-y-5"
                    >
                        <p className="text-xs text-gray-500">九九｜形でおぼえる</p>
                        <h2 className="text-3xl font-extrabold text-lime-700">おつかれさま！</h2>
                        <p className="text-sm text-gray-700">{dan}のだんを 8もん できたね</p>

                        <div className="flex flex-col gap-3 max-w-xs mx-auto">
                            <button
                                onClick={start}
                                className="px-8 py-3 rounded-xl bg-black text-white hover:opacity-90 transition"
                            >
                                もういちど
                            </button>
                            <button
                                onClick={resetToMenu}
                                className="px-8 py-3 rounded-xl border hover:bg-gray-50 transition"
                            >
                                段をえらぶ
                            </button>
                            {onExit && (
                                <button
                                    onClick={onExit}
                                    className="text-sm underline opacity-70 hover:opacity-100 transition mt-1"
                                >
                                    ← もどる
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
