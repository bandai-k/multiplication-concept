// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t mt-20 py-6 text-center text-xs text-gray-500">
      <p>© {new Date().getFullYear()} multiplication-concept</p>
      <p className="mt-1">
        このサイトは無料で公開しています。
      </p>
    </footer>
  );
}
