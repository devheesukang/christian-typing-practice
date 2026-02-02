"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RetroPanel from "@/components/RetroPanel";
import RetroButton from "@/components/RetroButton";
import { safeLocalStorage, LAST_RESULT_KEY } from "@/lib/storage";
import type { GameResult } from "@/lib/types";

export default function ClearPage() {
  const router = useRouter();
  const [result, setResult] = useState<GameResult | null>(null);

  useEffect(() => {
    setResult(safeLocalStorage.get<GameResult | null>(LAST_RESULT_KEY, null));
  }, []);

  return (
    <div className="retro-wood min-h-screen p-6 text-amber-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <RetroPanel title="클리어!">
          {result ? (
            <div className="space-y-3 text-sm">
              <div className="text-lg font-semibold">{result.nickname}</div>
              <div>기록: {result.durationLabel}</div>
              <div>오타: {result.wrongCount}</div>
              <div>ShiftLeft: {result.shiftLeft}</div>
              <div>ShiftRight: {result.shiftRight}</div>
              <div className="text-xs text-amber-700">
                버전: {result.prayerVersion === "new" ? "새 주기도문" : "개역한글"}
              </div>
            </div>
          ) : (
            <div className="text-sm">최근 기록이 없습니다.</div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <RetroButton onClick={() => router.push("/")}>메인 메뉴</RetroButton>
            <RetroButton variant="secondary" onClick={() => router.push("/game")}>
              다시 하기
            </RetroButton>
            <RetroButton variant="secondary" onClick={() => router.push("/ranking")}>
              랭킹 보기
            </RetroButton>
          </div>
        </RetroPanel>
      </div>
    </div>
  );
}
