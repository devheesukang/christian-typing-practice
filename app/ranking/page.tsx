"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import RetroPanel from "@/components/RetroPanel";
import RetroButton from "@/components/RetroButton";
import { safeLocalStorage, SCORES_KEY } from "@/lib/storage";
import type { ScoreEntry } from "@/lib/types";
import { formatElapsed } from "@/lib/typing";

const PIN = "1234";

export default function RankingPage() {
  const router = useRouter();
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [pinInput, setPinInput] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setScores(safeLocalStorage.get<ScoreEntry[]>(SCORES_KEY, []));
  }, []);

  useEffect(() => {
    if (!message) return;
    setMessage("");
  }, [pinInput]);

  const ordered = useMemo(
    () => [...scores].sort((a, b) => a.timeMs - b.timeMs),
    [scores]
  );

  const saveScores = (next: ScoreEntry[]) => {
    setScores(next);
    safeLocalStorage.set(SCORES_KEY, next);
  };

  const requirePin = () => {
    if (pinInput === PIN) return true;
    setMessage("PIN이 올바르지 않습니다.");
    return false;
  };

  return (
    <div className="retro-wood min-h-screen p-6 text-amber-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <RetroPanel title="랭킹">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold">PIN</label>
              <input
                className="w-24 rounded-md border border-amber-300 bg-white/80 px-2 py-1"
                value={pinInput}
                onChange={(event) => setPinInput(event.target.value)}
                placeholder="1234"
              />
            </div>
            {message ? <div className="text-xs text-red-700">{message}</div> : null}
            <RetroButton variant="secondary" onClick={() => router.push("/")}>
              돌아가기
            </RetroButton>
          </div>

          <div className="space-y-3 text-sm">
            {ordered.length === 0 ? (
              <div className="rounded-lg border border-dashed border-amber-300 p-6 text-center">
                저장된 기록이 없습니다.
              </div>
            ) : (
              ordered.map((score, index) => (
                <div
                  key={score.id}
                  className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-white/80 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-base font-semibold">
                      #{index + 1} {score.nickname}
                    </div>
                    <div className="text-sm font-semibold text-amber-700">
                      {formatElapsed(score.timeMs)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-amber-700">
                    <div>오타: {score.wrongCount}</div>
                    <div>ShiftLeft: {score.shiftLeft}</div>
                    <div>ShiftRight: {score.shiftRight}</div>
                    <div>{score.prayerVersion === "new" ? "새 주기도문" : "개역한글"}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <RetroButton
                      variant="secondary"
                      onClick={() => {
                        const next = window.prompt("새 닉네임을 입력하세요.", score.nickname);
                        if (!next) return;
                        saveScores(
                          scores.map((item) =>
                            item.id === score.id ? { ...item, nickname: next } : item
                          )
                        );
                      }}
                    >
                      닉네임 수정
                    </RetroButton>
                    <RetroButton
                      variant="secondary"
                      onClick={() => {
                        if (!requirePin()) return;
                        saveScores(scores.filter((item) => item.id !== score.id));
                      }}
                    >
                      기록 삭제
                    </RetroButton>
                  </div>
                </div>
              ))
            )}
          </div>
        </RetroPanel>
      </div>
    </div>
  );
}
