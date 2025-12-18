// components/HintPanel.tsx
type Props = {
  hintLevel: number; // 0..3
  hintSteps: string[]; // length >= 3
};

export default function HintPanel({ hintLevel, hintSteps }: Props) {
  if (hintLevel <= 0) return null;

  const stepsToShow = hintSteps.slice(0, hintLevel);

  return (
    <div className="mt-3 p-4 bg-white border rounded-2xl">
      <p className="text-sm font-semibold mb-2">ヒント</p>
      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
        {stepsToShow.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
