"use client";

import { useEffect, useRef } from "react";

type Props = {
  inputText: string;
  showCursor?: boolean;
};

export default function TypingPanel({ inputText, showCursor = true }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [inputText]);

  return (
    <div
      ref={containerRef}
      className="retro-scroll scanlines h-full w-full overflow-y-auto bg-white p-4 text-2xl text-[var(--retro-green-dark)] shadow-inner"
    >
      <div className="whitespace-pre-wrap break-words font-mono leading-relaxed">
        {inputText}
        {showCursor ? <span className="ml-1 animate-pulse">▮</span> : null}
      </div>
    </div>
  );
}
