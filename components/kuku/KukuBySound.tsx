// components/kuku/KukuBySound.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KUKU_SOUND_DATA, type KukuSoundItem } from "../../data/kukuSoundData";

type Phase = "select" | "playing";

type Props = {
    onExit?: () => void;
    minDan?: number;
    maxDan?: number;
};

const AUDIO_EXT = "wav"; // ← "mp3" にするならここだけ変更

const range = (min: number, max: number) =>
    Array.from({ length: max - min + 1 }, (_, i) => min + i);

const DAN_NAME: Record<number, string> = {
    1: "いち",
    2: "に",
    3: "さん",
    4: "し",
    5: "ご",
    6: "ろく",
    7: "しち",
    8: "はち",
    9: "く",
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const playAudioFile = (src: string) =>
    new Promise<void>((resolve, reject) => {
        const audio = new Audio(src);
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error("audio load failed"));
        audio.play().catch(reject);
    });

export default function KukuBySound({ onExit, minDan = 1, maxDan = 9 }: Props) {
    const [phase, setPhase] = useState<Phase>("select");
    const [dan, setDan] = useState<number>(2);
    const [index, setIndex] = useState(0);

    // 自動連続再生
    const [autoPlay, setAutoPlay] = useState(true);

    // WebSpeech用（フォールバック時のみ使用）
    const [rate, setRate] = useState(0.95);

    // 間（自然さ）
    const [pauseAfterIntroMs, setPauseAfterIntroMs] = useState(250);
    const [gapMs, setGapMs] = useState(450);

    // 段の最初に導入を読む
    const [introEnabled, setIntroEnabled] = useState(true);

    const list = useMemo(() => {
        return KUKU_SOUND_DATA.filter((q) => q.a === dan).sort((x, y) => x.b - y.b);
    }, [dan]);

    const current: KukuSoundItem | undefined = list[index];
    const atEnd = index >= list.length - 1;

    const timerRef = useRef<number | null>(null);
    const introSpokenRef = useRef(false);
    const playTokenRef = useRef(0); // 停止/段変更で古い再生を無効化

    const clearTimer = () => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const cancelSpeech = () => {
        if (typeof window === "undefined") return;
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };

    /**
     * reading の再生：
     * 1) /public/audio/kuku/{a}-{b}.{ext} があればそれを再生
     * 2) なければ WebSpeech で reading をそのまま読む（補完しない）
     */
    const speakReading = async (item: KukuSoundItem, token: number) => {
        const src = `/audio/kuku/${item.a}-${item.b}.${AUDIO_EXT}`;
        try {
            if (playTokenRef.current !== token) return;
            await playAudioFile(src);
            return;
        } catch {
            // fallback
        }

        // --- fallback: Web Speech API ---
        if (typeof window === "undefined") return;
        if (!("speechSynthesis" in window)) return;
        if (playTokenRef.current !== token) return;

        window.speechSynthesis.cancel();
        const uttr = new SpeechSynthesisUtterance(item.reading);
        uttr.lang = "ja-JP";
        uttr.rate = rate;
        uttr.pitch = 1.0;

        await new Promise<void>((resolve) => {
            uttr.onend = () => resolve();
            uttr.onerror = () => resolve();
            window.speechSynthesis.speak(uttr);
        });
    };

    /**
     * 導入の再生（全段対応）：
     * 1) /public/audio/kuku/intro-{dan}.{ext} があればそれを再生
     * 2) なければ WebSpeech で「◯のだん、いくよ」
     */
    const speakIntro = async (token: number) => {
        if (!introEnabled) return;

        const src = `/audio/kuku/intro-${dan}.${AUDIO_EXT}`;
        try {
            if (playTokenRef.current !== token) return;
            await playAudioFile(src);
            if (playTokenRef.current !== token) return;
            await sleep(pauseAfterIntroMs);
            return;
        } catch {
            // fallback
        }

        // --- fallback: Web Speech API ---
        const danName = DAN_NAME[dan] ?? `${dan}`;
        if (typeof window === "undefined") return;
        if (!("speechSynthesis" in window)) return;
        if (playTokenRef.current !== token) return;

        window.speechSynthesis.cancel();
        const uttr = new SpeechSynthesisUtterance(`${danName}のだん、いくよ`);
        uttr.lang = "ja-JP";
        uttr.rate = rate;
        uttr.pitch = 1.0;

        await new Promise<void>((resolve) => {
            uttr.onend = () => resolve();
            uttr.onerror = () => resolve();
            window.speechSynthesis.speak(uttr);
        });

        if (playTokenRef.current !== token) return;
        await sleep(pauseAfterIntroMs);
    };

    const goNext = () => {
        setIndex((prev) => {
            const next = prev + 1;
            if (next >= list.length) return prev;
            return next;
        });
    };

    const startDan = (d: number) => {
        setDan(d);
        setIndex(0);
        setPhase("playing");
        introSpokenRef.current = false;

        playTokenRef.current++;
        clearTimer();
        cancelSpeech();
    };

    const backToSelect = () => {
        setPhase("select");
        setIndex(0);
        introSpokenRef.current = false;

        playTokenRef.current++;
        clearTimer();
        cancelSpeech();
    };

    useEffect(() => {
        return () => {
            playTokenRef.current++;
            clearTimer();
            cancelSpeech();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 自動再生：導入 → reading丸ごと → gap → 次
    useEffect(() => {
        if (phase !== "playing") return;
        if (!current) return;
        if (!autoPlay) return;

        const token = ++playTokenRef.current;

        const run = async () => {
            // 段の1問目だけ導入
            if (index === 0 && !introSpokenRef.current) {
                introSpokenRef.current = true;
                await speakIntro(token);
                if (playTokenRef.current !== token) return;
            }

            // reading丸ごと
            await speakReading(current, token);
            if (playTokenRef.current !== token) return;

            if (atEnd) return;

            clearTimer();
            timerRef.current = window.setTimeout(() => {
                goNext();
            }, gapMs);
        };

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, dan, index, autoPlay, rate, introEnabled, pauseAfterIntroMs, gapMs]);

    // -------------------------
    // select
    // -------------------------
    if (phase === "select") {
        return (
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white border rounded-2xl shadow p-6 text-center"
            >
                <p className="text-xs text-gray-500 mb-2">九九｜耳でおぼえる</p>
                <h2 className="text-2xl font-bold mb-2">どのだんを きく？</h2>
                <p className="text-sm text-gray-600 mb-6">
                    /public/audio/kuku/intro-◯.{AUDIO_EXT} と /public/audio/kuku/◯-◯.
                    {AUDIO_EXT} があれば優先して再生します（無ければ自動で代替）。
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {range(minDan, maxDan).map((d) => (
                        <button
                            key={d}
                            onClick={() => startDan(d)}
                            className="px-4 py-3 rounded-xl border hover:bg-gray-50 transition font-semibold"
                        >
                            {d} のだん
                        </button>
                    ))}
                </div>

                {onExit && (
                    <button
                        onClick={onExit}
                        className="text-sm underline opacity-70 hover:opacity-100 transition"
                    >
                        ← もどる
                    </button>
                )}
            </motion.section>
        );
    }

    if (!current) return null;

    // -------------------------
    // playing
    // -------------------------
    return (
        <section className="bg-white border rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={backToSelect}
                    className="text-sm underline opacity-70 hover:opacity-100 transition"
                >
                    ← だんをえらびなおす
                </button>

                <p className="text-xs text-gray-500">
                    {dan}のだん（{index + 1}/{list.length}）
                </p>
            </div>

            <div className="text-center mb-5">
                <p className="text-4xl font-extrabold text-gray-900 mb-2">
                    {current.a} × {current.b}
                </p>

                {/* 正式なreading（そのまま表示） */}
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                    {current.reading}
                </p>

                <p className="text-sm text-gray-500">= {current.result}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                    onClick={async () => {
                        playTokenRef.current++;
                        clearTimer();
                        cancelSpeech();

                        const token = ++playTokenRef.current;
                        await speakReading(current, token);
                    }}
                    className="px-6 py-3 rounded-xl border hover:bg-gray-50 transition"
                >
                    🔊 もういちど
                </button>

                <button
                    onClick={() => {
                        if (autoPlay) {
                            setAutoPlay(false);
                            playTokenRef.current++;
                            clearTimer();
                            cancelSpeech();
                        } else {
                            setAutoPlay(true);
                        }
                    }}
                    className="px-6 py-3 rounded-xl bg-black text-white hover:opacity-90 transition"
                >
                    {autoPlay ? "⏸ とめる" : "▶ つづける"}
                </button>

                <button
                    onClick={() => {
                        playTokenRef.current++;
                        clearTimer();
                        cancelSpeech();
                        if (!atEnd) setIndex((v) => v + 1);
                    }}
                    disabled={atEnd}
                    className="px-6 py-3 rounded-xl bg-lime-600 text-white hover:bg-lime-700 transition disabled:opacity-50"
                >
                    つぎへ ▶
                </button>
            </div>

            {/* 設定（フォールバック時のWebSpeechに効く） */}
            <div className="bg-gray-50 border rounded-xl p-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-2">（代替音声）よみあげの はやさ</p>
                        <input
                            type="range"
                            min={0.7}
                            max={1.1}
                            step={0.05}
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full"
                        />
                        <p className="text-sm text-gray-700 mt-1">x{rate.toFixed(2)}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-2">つぎまでの ま（ms）</p>
                        <input
                            type="range"
                            min={200}
                            max={1200}
                            step={50}
                            value={gapMs}
                            onChange={(e) => setGapMs(Number(e.target.value))}
                            className="w-full"
                        />
                        <p className="text-sm text-gray-700 mt-1">{gapMs}ms</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-2">導入のあと（ms）</p>
                        <input
                            type="range"
                            min={0}
                            max={800}
                            step={50}
                            value={pauseAfterIntroMs}
                            onChange={(e) => setPauseAfterIntroMs(Number(e.target.value))}
                            className="w-full"
                        />
                        <p className="text-sm text-gray-700 mt-1">{pauseAfterIntroMs}ms</p>
                    </div>

                    <div className="flex items-center gap-2 mt-6 md:mt-0">
                        <input
                            id="intro"
                            type="checkbox"
                            checked={introEnabled}
                            onChange={(e) => setIntroEnabled(e.target.checked)}
                            className="h-4 w-4"
                        />
                        <label htmlFor="intro" className="text-sm text-gray-700">
                            段のはじめに「◯のだん、いくよ」
                        </label>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                    例：/audio/kuku/intro-2.{AUDIO_EXT}、/audio/kuku/2-5.{AUDIO_EXT}
                </p>
            </div>

            <AnimatePresence>
                {atEnd && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="mt-6 text-center"
                    >
                        <p className="text-sm text-gray-600 mb-3">{dan}のだん おわり！</p>
                        <button
                            onClick={backToSelect}
                            className="px-8 py-3 rounded-xl border hover:bg-gray-50 transition"
                        >
                            ほかのだんへ
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
