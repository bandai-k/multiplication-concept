// pages/learn.tsx
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MultiplicationTrainer from "../components/MultiplicationTrainer";

export default function Learn() {
  return (
    <>
      <Head>
        <title>かけ算を考える | かけ算のしくみ</title>
        <meta
          name="description"
          content="九九を覚える前に、かけ算の考え方を図で理解する学習ページです。"
        />
      </Head>

      <Header />

      <main className="max-w-3xl mx-auto px-6 py-20 pt-32">
        <h1 className="text-2xl font-bold text-center mb-6">
          かけ算を かんがえてみよう
        </h1>

        <MultiplicationTrainer />
      </main>

      <Footer />
    </>
  );
}
