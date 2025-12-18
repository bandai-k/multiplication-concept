// pages/about.tsx
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Head>
        <title>このサイトについて｜かけ算のしくみ</title>
        <meta
          name="description"
          content="『かけ算のしくみ』は、九九を覚える前に掛け算の意味を理解するための無料学習サイトです。"
        />
      </Head>

      <Header />

      <main className="max-w-3xl mx-auto px-6 py-20 pt-32">
        <h1 className="text-3xl font-bold mb-8 text-center">
          このサイトについて
        </h1>

        {/* サイトの目的 */}
        <section className="space-y-4 text-gray-700 leading-relaxed mb-12">
          <p>
            <strong>「かけ算のしくみ」</strong>は、
            小学校2年生向けの、無料学習サイトです。
          </p>
          <p>
            九九を暗記する前に、
            <br />
            <em>「◯が△こあると、ぜんぶでいくつ？」</em>
            という考え方を、
            図を使って、ゆっくり理解することを目的としています。
          </p>
          <p>
            点数・ランキング・時間制限はありません。
            <br />
            まちがえても大丈夫な設計にしています。
          </p>
        </section>

        {/* こんなご家庭に */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            こんなご家庭に向いています
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>九九を覚えるのが苦手なお子さん</li>
            <li>式は書けるけれど、意味がよく分かっていない</li>
            <li>「どう教えたらいいか分からない」と感じている</li>
            <li>短い時間で、無理なく学習したい</li>
          </ul>
        </section>

        {/* 制作者について */}
        <section className="bg-gray-50 border rounded-2xl p-6 text-gray-700 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold mb-4">
            制作者について
          </h2>
          <p className="mb-3">
            このサイトは、ITエンジニアであり、
            小学生の子どもを育てる親が、個人で制作しています。
          </p>
          <p className="mb-3">
            家庭で子どもに勉強を教える中で、
            <br />
            「答えは合っているのに、意味が分かっていない」
            という場面に何度も出会いました。
          </p>
          <p>
            その経験から、
            <br />
            <strong>「暗記する前に、考え方が分かる場所」</strong>
            として、このサイトを作りました。
          </p>
        </section>

        {/* フッター前の一言 */}
        <section className="mt-12 text-center text-sm text-gray-600">
          <p>
            このサイトは、無料で公開しています。
            <br />
            改善のためのご意見・ご感想は歓迎です。
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
