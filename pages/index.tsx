// pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>かけ算のしくみ｜九九を覚える前に意味がわかる</title>
        <meta
          name="description"
          content="小学校2年生向け。九九を覚える前に「かけ算の意味」を図で理解する無料学習サイト。1日8問、5〜10分。"
        />
      </Head>

      <Header />

      <main className="max-w-3xl mx-auto px-6 py-20 pt-32">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-4">
            かけ算のしくみ
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            九九を覚える前に、
            <br />
            「かけ算の意味」がわかる。
          </p>
          <p className="text-sm text-gray-500">
            小学校2年生向け・無料学習サイト
          </p>

          <div className="mt-8">
            <Link
              href="/learn"
              className="inline-block px-8 py-4 rounded-xl bg-black text-white text-lg hover:opacity-90 transition"
            >
              今日の問題をはじめる
            </Link>
            <p className="mt-2 text-xs text-gray-400">
              ※ 登録不要・無料
            </p>
          </div>
        </section>

        {/* About */}
        <section className="space-y-6 text-gray-700 leading-relaxed mb-16">
          <p>
            このサイトは、九九を暗記するためのものではありません。
          </p>
          <p>
            「3 が 4 こ あると、ぜんぶで いくつ？」という考え方を、
            図と問題で、ゆっくり身につけるための無料学習サイトです。
          </p>

          <ul className="list-disc list-inside text-sm space-y-1">
            <li>毎日 8問だけ</li>
            <li>1回 5〜10分</li>
            <li>点数・ランキングはありません</li>
          </ul>
        </section>

        {/* For parents */}
        <section className="bg-gray-50 border rounded-2xl p-6 text-sm text-gray-700">
          <h2 className="font-semibold mb-3">おうちの人へ</h2>
          <p>
            まちがえても大丈夫です。
            <br />
            「どう考えたの？」と声をかけてもらえると、
            子どもは安心して取り組めます。
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
