"use client";

type Props = {
  leftActive: boolean;
  rightActive: boolean;
  leftCount: number;
  rightCount: number;
};

export default function ShiftIndicator({ leftActive, rightActive, leftCount, rightCount }: Props) {
  return (
    <div className="flex items-center gap-4 text-xs text-amber-900">
      <div
        className={`rounded-md border px-3 py-1 ${
          leftActive ? "bg-amber-200 border-amber-400" : "bg-amber-50 border-amber-200"
        }`}
      >
        ShiftLeft: {leftCount}
      </div>
      <div
        className={`rounded-md border px-3 py-1 ${
          rightActive ? "bg-amber-200 border-amber-400" : "bg-amber-50 border-amber-200"
        }`}
      >
        ShiftRight: {rightCount}
      </div>
    </div>
  );
}
