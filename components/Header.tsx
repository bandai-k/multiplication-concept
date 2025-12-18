// components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg">
          かけ算のしくみ
        </Link>

        <nav className="flex gap-4 text-sm text-gray-600">
          <Link href="/learn" className="hover:underline">
            学習
          </Link>
          <Link href="/about" className="hover:underline">
            このサイトについて
          </Link>
        </nav>
      </div>
    </header>
  );
}
