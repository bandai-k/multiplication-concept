// components/EmojiBags.tsx
type Props = {
    /** 1まとまりの中身（例：🍬） */
    itemEmoji: string;
    /** 1まとまりの個数（例：3） */
    perContainer: number;
    /** まとまりの数（例：4） */
    containerCount: number;
    /** まとまりの名称（例：ふくろ） */
    containerLabel: string;
};

export default function EmojiBags({
    itemEmoji,
    perContainer,
    containerCount,
    containerLabel,
}: Props) {
    return (
        <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: containerCount }).map((_, i) => (
                <div
                    key={i}
                    className="w-[120px] rounded-2xl border bg-white shadow-sm p-3"
                    aria-label={`${containerLabel}${i + 1}`}
                >
                    <div className="text-xs text-gray-500 text-center mb-2">
                        {containerLabel}
                    </div>

                    <div className="flex flex-wrap justify-center gap-1 text-2xl leading-none">
                        {Array.from({ length: perContainer }).map((__, j) => (
                            <span key={j} aria-hidden="true">
                                {itemEmoji}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
