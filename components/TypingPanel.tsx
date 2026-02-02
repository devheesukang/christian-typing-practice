"use client";

type Props = {
  inputText: string;
  showCursor?: boolean;
};

export default function TypingPanel({ inputText, showCursor = true }: Props) {
  return (
    <div className="retro-panel scanlines h-64 w-full overflow-hidden rounded-2xl bg-[var(--retro-green)] p-4 text-2xl text-[var(--retro-green-dark)] shadow-inner">
      <div className="whitespace-pre-wrap break-words font-mono leading-relaxed">
        {inputText}
        {showCursor ? <span className="ml-1 animate-pulse">▮</span> : null}
      </div>
    </div>
  );
}
