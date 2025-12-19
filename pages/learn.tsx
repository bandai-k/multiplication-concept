// pages/learn.tsx
import Head from "next/head";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MultiplicationTrainer from "../components/MultiplicationTrainer";
import KukuBySound from "../components/kuku/KukuBySound";
import KukuByShape from "../components/kuku/KukuByShape";

type LearnMode =
  | { kind: "menu" }
  | { kind: "concept"; step: "A" | "B" | "C" | "D" }
  | { kind: "kuku_sound" }
  | { kind: "kuku_shape" };

export default function Learn() {
  const [mode, setMode] = useState<LearnMode>({ kind: "menu" });
  const goMenu = () => setMode({ kind: "menu" });

  return (
    <>
      <Head>
        <title>学習 | かけ算のしくみ</title>
        <meta
          name="description"
          content="かけ算のしくみを絵で理解し、九九は『耳』『形』に分けて覚える学習ページです。"
        />
      </Head>

      <Header isScrolled={false} />

      <main className="max-w-5xl mx-auto px-6 py-20 pt-32">
        {mode.kind === "menu" && (
          <>
            <h1 className="text-2xl font-bold text-center mb-2">
              ここからえらぶ
            </h1>
            <p className="text-sm text-gray-600 text-center mb-8">
              「しくみ」は考える学習。九九は「耳」「形」で別の覚え方に分けます。
            </p>

            {/* ① しくみ（A〜D） */}
            <section className="bg-white border rounded-2xl shadow p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">
                ① かけ算のしくみ（絵で考える）
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setMode({ kind: "concept", step: "A" })}
                  className="text-left p-4 rounded-xl border hover:bg-gray-50 transition"
                >
                  <div className="font-semibold">ステップA（2〜4）</div>
                  <div className="text-xs text-gray-500 mt-1">
                    まとまりのイメージを作る
                  </div>
                </button>

                <button
                  onClick={() => setMode({ kind: "concept", step: "B" })}
                  className="text-left p-4 rounded-xl border hover:bg-gray-50 transition"
                >
                  <div className="font-semibold">ステップB（2〜5）</div>
                  <div className="text-xs text-gray-500 mt-1">
                    数が増えても考え方は同じ
                  </div>
                </button>

                <button
                  onClick={() => setMode({ kind: "concept", step: "C" })}
                  className="text-left p-4 rounded-xl border hover:bg-gray-50 transition"
                >
                  <div className="font-semibold">ステップC（6以上）</div>
                  <div className="text-xs text-gray-500 mt-1">
                    つまずきやすい段を構造で越える
                  </div>
                </button>

                <button
                  onClick={() => setMode({ kind: "concept", step: "D" })}
                  className="text-left p-4 rounded-xl border hover:bg-gray-50 transition"
                >
                  <div className="font-semibold">ステップD（ミックス）</div>
                  <div className="text-xs text-gray-500 mt-1">
                    どの段でも同じ考え方（総合）
                  </div>
                </button>
              </div>
            </section>

            {/* ② 九九（耳） */}
            <section className="bg-white border rounded-2xl shadow p-6 mb-6">
              <h2 className="text-lg font-bold mb-2">② 九九をおぼえる（耳）</h2>
              <p className="text-sm text-gray-600 mb-4">
                まず「読み方」を体に入れます。入力はしません。
              </p>

              <button
                onClick={() => setMode({ kind: "kuku_sound" })}
                className="w-full text-left p-4 rounded-xl border hover:bg-gray-50 transition"
              >
                <div className="font-semibold">👂 耳でおぼえる（読む・唱える）</div>
                <div className="text-xs text-gray-500 mt-1">
                  読み上げ→いっしょに言う→口で言えるか確認
                </div>
              </button>
            </section>

            {/* ③ 九九（形） */}
            <section className="bg-white border rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold mb-2">③ 九九をおぼえる（形）</h2>
              <p className="text-sm text-gray-600 mb-4">
                “思い出す”練習。穴埋めで記憶を固定します。
              </p>

              <button
                onClick={() => setMode({ kind: "kuku_shape" })}
                className="w-full text-left p-4 rounded-xl border hover:bg-gray-50 transition"
              >
                <div className="font-semibold">👀 形でおぼえる（穴埋め）</div>
                <div className="text-xs text-gray-500 mt-1">
                  1けた穴埋め／どれ×？／ミニ九九表の穴埋め
                </div>
              </button>
            </section>

            <p className="mt-8 text-center text-xs text-gray-400">
              ※ 点数やランキングはありません
            </p>
          </>
        )}

        {/* しくみ（A〜D） */}
        {mode.kind === "concept" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={goMenu}
                className="text-sm underline opacity-70 hover:opacity-100 transition"
              >
                ← えらびなおす
              </button>
              <p className="text-xs text-gray-500">しくみ：{mode.step}</p>
            </div>

            <MultiplicationTrainer initialStep={mode.step} onExit={goMenu} />
          </>
        )}

        {/* 九九（耳） */}
        {mode.kind === "kuku_sound" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={goMenu}
                className="text-sm underline opacity-70 hover:opacity-100 transition"
              >
                ← えらびなおす
              </button>
              <p className="text-xs text-gray-500">九九：耳でおぼえる</p>
            </div>

            <KukuBySound onExit={goMenu} />
          </>
        )}

        {/* 九九（形） */}
        {mode.kind === "kuku_shape" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={goMenu}
                className="text-sm underline opacity-70 hover:opacity-100 transition"
              >
                ← えらびなおす
              </button>
              <p className="text-xs text-gray-500">九九：形でおぼえる</p>
            </div>

            <KukuByShape onExit={goMenu} />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
