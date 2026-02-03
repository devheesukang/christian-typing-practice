"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RetroButton from "@/components/RetroButton";
import ConfirmModal from "@/components/ConfirmModal";
import { PRAYER_DESCRIPTIONS, PRAYER_TITLES, type PrayerVersion } from "@/lib/prayers";
import { safeLocalStorage, SCORES_KEY } from "@/lib/storage";
import type { ScoreEntry } from "@/lib/types";
import { formatElapsed } from "@/lib/typing";
import { useAppContext } from "@/state/AppContext";

export default function Home() {
  const router = useRouter();
  const { settings, setSettings } = useAppContext();
  const [selected, setSelected] = useState<PrayerVersion>("new");
  const [menu, setMenu] = useState<"start" | "records" | "settings">("start");
  const initialScoresRef = useRef<ScoreEntry[]>(
    safeLocalStorage.get<ScoreEntry[]>(SCORES_KEY, [])
  );
  const [scores, setScores] = useState<ScoreEntry[]>(initialScoresRef.current);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const orderedScores = [...scores].sort((a, b) => a.timeMs - b.timeMs);

  const saveScores = (next: ScoreEntry[]) => {
    setScores(next);
    safeLocalStorage.set(SCORES_KEY, next);
  };

  const updateSettings = (patch: Partial<typeof settings>) => {
    setSettings({ ...settings, ...patch });
  };

  return (
    <div className="wood-bg min-h-screen p-6 text-amber-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="연동과컴퓨터 로고" className="h-[28px] w-[28px] pb-0.5" />
            <div className="text-lg font-semibold font-['NixgonFont']">연동과컴퓨터</div>
          </div>
        </header>

        <div className="m-auto">
          <div className="mb-3 text-2xl font-semibold tracking-wide text-amber-900 font-['NixgonFont']">
            주기도문
          </div>
          <div className="retro-title block-title text-5xl text-white font-['Welcome']">
            타자 연습
          </div>
        </div>

        <div className="w-full rounded-md border border-emerald-900/40 bg-[#0c4b43] px-4 py-3 text-sm text-emerald-100 shadow-inner">
          user, 자리 연습 단계 : 1, 낱말 연습 단계 : 1, 자판 종류 : 두벌식 표준
        </div>

        <main className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            {[
              {
                key: "start" as const,
                label: "연습 시작",
                onClick: () => setMenu("start"),
                img: "/buttons_1.png",
              },
              {
                key: "records" as const,
                label: "기록 보기",
                onClick: () => setMenu("records"),
                img: "/buttons_2.png",
              },
              {
                key: "settings" as const,
                label: "환경 설정",
                onClick: () => setMenu("settings"),
                img: "/buttons_3.png",
              },
              {
                key: "exit" as const,
                label: "끝",
                onClick: () => {
                  if (typeof window !== "undefined") {
                    window.close();
                    router.push("/");
                  }
                },
                img: "/buttons_4.png",
              },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={`menu-image-button relative flex w-full items-center justify-start text-left text-lg font-semibold text-[#5a3a1f] ${
                  item.key && menu === item.key ? "is-active" : ""
                }`}
              >
                <img src={item.img} alt={item.label} className="block h-auto w-full" />
                <span className="menu-label absolute left-32 top-1/2 -translate-y-1/2">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="inset-panel rounded-2xl p-6 max-h-[500px] overflow-hidden">
            {menu === "start" ? (
              <>
                <div className="mb-4 text-lg font-semibold">설명</div>
                <div className="space-y-3 text-sm leading-relaxed">
                  <div className="text-base font-semibold">{PRAYER_TITLES[selected]}</div>
                  <p>{PRAYER_DESCRIPTIONS[selected]}</p>
                  <p className="text-xs text-amber-700">
                    쉼표와 마침표는 입력하지 않습니다. Enter 없이 공백을 입력하세요.
                  </p>
                </div>
                <div className="mt-6 space-y-3">
                  {(["new", "classic"] as PrayerVersion[]).map((version) => (
                    <button
                      key={version}
                      type="button"
                      onClick={() => setSelected(version)}
                      className={`w-full rounded-lg border px-4 py-3 text-left ${
                        selected === version
                          ? "border-amber-400 bg-amber-100"
                          : "border-amber-200 bg-white/70"
                      }`}
                    >
                      <div className="font-semibold">{PRAYER_TITLES[version]}</div>
                      <div className="text-xs text-amber-700">협업 모드 / 기본 난이도</div>
                    </button>
                  ))}
                  <RetroButton
                    className="mt-2 w-full"
                    onClick={() => {
                      setSettings({ ...settings, prayerVersion: selected });
                      router.push("/nickname");
                    }}
                  >
                    선택하고 시작
                  </RetroButton>
                </div>
              </>
            ) : null}

            {menu === "records" ? (
              <>
                <div className="mb-4 text-lg font-semibold">기록 보기</div>
                <div className="retro-scroll space-y-3 text-sm overflow-y-auto max-h-[420px] pr-2">
                  {orderedScores.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-amber-300 p-6 text-center">
                      저장된 기록이 없습니다.
                    </div>
                  ) : (
                    orderedScores.map((score, index) => (
                      <div
                        key={score.id}
                        className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-white/80 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-base font-semibold">
                            #{index + 1}{" "}
                            {editingId === score.id ? (
                              <input
                                className="ml-2 w-40 rounded-md border border-amber-300 bg-white px-2 py-1 text-sm"
                                value={editingValue}
                                onChange={(event) => setEditingValue(event.target.value)}
                              />
                            ) : (
                              score.nickname
                            )}
                          </div>
                          <div className="text-sm font-semibold text-amber-700">
                            {formatElapsed(score.timeMs)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-amber-700">
                          <div>타수: {score.cpm ?? "-"}</div>
                          <div>
                            정확도: {score.accuracy != null ? `${score.accuracy}%` : "-"}
                          </div>
                          <div>{score.prayerVersion === "new" ? "새 주기도문" : "개역한글"}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {editingId === score.id ? (
                            <RetroButton
                              variant="secondary"
                              onClick={() => {
                                const next = editingValue.trim();
                                if (!next) return;
                                saveScores(
                                  scores.map((item) =>
                                    item.id === score.id ? { ...item, nickname: next } : item
                                  )
                                );
                                setEditingId(null);
                                setEditingValue("");
                              }}
                            >
                              확인
                            </RetroButton>
                          ) : (
                            <RetroButton
                              variant="secondary"
                              onClick={() => {
                                setEditingId(score.id);
                                setEditingValue(score.nickname);
                              }}
                            >
                              닉네임 수정
                            </RetroButton>
                          )}
                          <RetroButton
                            variant="secondary"
                            onClick={() => {
                              setConfirmDeleteId(score.id);
                            }}
                          >
                            기록 삭제
                          </RetroButton>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : null}

            {menu === "settings" ? (
              <>
                <div className="mb-4 text-lg font-semibold">환경 설정</div>
                <div className="space-y-5 text-sm text-amber-900">
                  <div>
                    <div className="mb-2 font-semibold">BGM</div>
                    <div className="flex flex-wrap gap-2">
                      <RetroButton
                        type="button"
                        variant={settings.bgmEnabled ? "primary" : "secondary"}
                        className={settings.bgmEnabled ? "is-selected" : ""}
                        aria-pressed={settings.bgmEnabled}
                        onClick={() => updateSettings({ bgmEnabled: true })}
                      >
                        ON
                      </RetroButton>
                      <RetroButton
                        type="button"
                        variant={!settings.bgmEnabled ? "primary" : "secondary"}
                        className={!settings.bgmEnabled ? "is-selected" : ""}
                        aria-pressed={!settings.bgmEnabled}
                        onClick={() => updateSettings({ bgmEnabled: false })}
                      >
                        OFF
                      </RetroButton>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-semibold">SFX</div>
                    <div className="flex flex-wrap gap-2">
                      <RetroButton
                        type="button"
                        variant={settings.sfxEnabled ? "primary" : "secondary"}
                        className={settings.sfxEnabled ? "is-selected" : ""}
                        aria-pressed={settings.sfxEnabled}
                        onClick={() => updateSettings({ sfxEnabled: true })}
                      >
                        ON
                      </RetroButton>
                      <RetroButton
                        type="button"
                        variant={!settings.sfxEnabled ? "primary" : "secondary"}
                        className={!settings.sfxEnabled ? "is-selected" : ""}
                        aria-pressed={!settings.sfxEnabled}
                        onClick={() => updateSettings({ sfxEnabled: false })}
                      >
                        OFF
                      </RetroButton>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </main>
      </div>

      <ConfirmModal
        open={confirmDeleteId !== null}
        message="정말로 삭제하시겠습니까?"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          if (!confirmDeleteId) return;
          saveScores(scores.filter((item) => item.id !== confirmDeleteId));
          setConfirmDeleteId(null);
        }}
      />
    </div>
  );
}
