// components/DotGrid.tsx
type Props = {
  cols: number;
  rows: number;
};

export default function DotGrid({ cols, rows }: Props) {
  return (
    <div className="p-4 bg-gray-50 rounded-2xl border shadow-sm">
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex gap-2 justify-center">
            {Array.from({ length: cols }).map((_, col) => (
              <span
                key={col}
                className="w-4 h-4 rounded-full bg-blue-500 inline-block"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
