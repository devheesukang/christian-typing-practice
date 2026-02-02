"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RetroPanel from "@/components/RetroPanel";
import RetroButton from "@/components/RetroButton";
import SettingsModal from "@/components/SettingsModal";
import TypingPanel from "@/components/TypingPanel";
import { PRAYER_TEXTS } from "@/lib/prayers";
import {
  normalizePrayerText,
  formatElapsed,
  clampTextInput,
  buildDisplayText,
} from "@/lib/typing";
import { playSfx, startBgm } from "@/lib/audio";
import { safeLocalStorage, SCORES_KEY, LAST_RESULT_KEY } from "@/lib/storage";
import type { ScoreEntry } from "@/lib/types";
import { useAppContext } from "@/state/AppContext";
import GamePanel from "@/components/GamePanel";
import GameSection from "@/components/GameSection";

export default function GamePage() {
  const router = useRouter();
  const { nickname, settings, setSettings } = useAppContext();
  const [inputText, setInputText] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shiftLeftCount, setShiftLeftCount] = useState(0);
  const [shiftRightCount, setShiftRightCount] = useState(0);
  const [showShiftHint, setShowShiftHint] = useState(false);
  const [hasShiftHinted, setHasShiftHinted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [rawValue, setRawValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [composingTail, setComposingTail] = useState("");
  const [showLangHint, setShowLangHint] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const langHintTimerRef = useRef<number | null>(null);
  const composeFrameRef = useRef<number | null>(null);

  const targetText = useMemo(
    () => normalizePrayerText(PRAYER_TEXTS[settings.prayerVersion]),
    [settings.prayerVersion]
  );
  const progress = Math.min(inputText.length / targetText.length, 1);
  const displayPrefix = buildDisplayText(
    PRAYER_TEXTS[settings.prayerVersion],
    inputText.length,
    !isComposing
  );
  const displayText = isComposing ? `${displayPrefix}${composingTail}` : displayPrefix;
  const elapsedSeconds = elapsed / 1000;
  const cpm = elapsedSeconds > 0 ? Math.round((inputText.length / elapsedSeconds) * 60) : 0;
  const accuracy =
    inputText.length + wrongCount > 0
      ? Math.round((inputText.length / (inputText.length + wrongCount)) * 100)
      : 100;
  const cpmRatio = Math.min(cpm / 800, 1);

  useEffect(() => {
    if (!nickname) router.replace("/nickname");
  }, [nickname, router]);

  useEffect(() => {
    let frame: number;
    const tick = () => {
      if (startTime !== null && !completed) {
        setElapsed(performance.now() - startTime);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [startTime, completed]);

  useEffect(() => {
    if (!settings.bgmEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }
    audioRef.current?.pause();
    audioRef.current = startBgm(settings.bgmTrack, 0.3);
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [settings.bgmEnabled, settings.bgmTrack]);

  useEffect(() => {
    if (!completed) return;
    audioRef.current?.pause();
  }, [completed]);

  useEffect(() => {
    if (hasShiftHinted) return;
    if (progress > 0.25 && shiftLeftCount + shiftRightCount === 0) {
      setShowShiftHint(true);
      setHasShiftHinted(true);
      const timer = window.setTimeout(() => setShowShiftHint(false), 2000);
      return () => window.clearTimeout(timer);
    }
  }, [progress, shiftLeftCount, shiftRightCount, hasShiftHinted]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isComposing) return;
    if (!textareaRef.current) return;
    if (textareaRef.current.value !== inputText) {
      textareaRef.current.value = inputText;
    }
    textareaRef.current.setSelectionRange(inputText.length, inputText.length);
    setRawValue(inputText);
  }, [inputText, isComposing]);

  useEffect(() => {
    return () => {
      if (composeFrameRef.current) {
        cancelAnimationFrame(composeFrameRef.current);
      }
    };
  }, []);

  const handleInput = (nextValue: string) => {
    if (completed) return;
    const cleaned = clampTextInput(nextValue);
    if (/[a-zA-Z]/.test(cleaned)) {
      setShowLangHint(true);
      if (langHintTimerRef.current) {
        window.clearTimeout(langHintTimerRef.current);
      }
      langHintTimerRef.current = window.setTimeout(() => {
        setShowLangHint(false);
        langHintTimerRef.current = null;
      }, 1800);
    }
    if (cleaned.length < inputText.length) {
      setRawValue(inputText);
      if (textareaRef.current) {
        textareaRef.current.value = inputText;
        textareaRef.current.setSelectionRange(inputText.length, inputText.length);
      }
      return;
    }
    const additions = cleaned.slice(inputText.length);
    if (!additions) return;
    let nextText = inputText;
    let nextWrong = 0;
    for (const char of additions) {
      const targetChar = targetText[nextText.length];
      if (!targetChar) break;
      if (char === targetChar) {
        nextText += char;
        playSfx("carve");
      } else {
        nextWrong += 1;
        playSfx("error");
      }
    }
    const baseStart = startTime ?? performance.now();
    if (startTime === null && nextText.length > 0) {
      setStartTime(baseStart);
    }
    if (nextWrong > 0) setWrongCount((prev) => prev + nextWrong);
    if (nextText !== inputText) setInputText(nextText);
    if (nextText.length >= targetText.length) {
      const finish = performance.now();
      const totalMs = finish - baseStart;
      setElapsed(totalMs);
      setCompleted(true);
      const entry: ScoreEntry = {
        id: crypto.randomUUID(),
        nickname: nickname || "TEAM",
        timeMs: totalMs,
        createdAt: new Date().toISOString(),
        wrongCount: wrongCount + nextWrong,
        shiftLeft: shiftLeftCount,
        shiftRight: shiftRightCount,
        prayerVersion: settings.prayerVersion,
      };
      const scores = safeLocalStorage.get<ScoreEntry[]>(SCORES_KEY, []);
      safeLocalStorage.set(SCORES_KEY, [...scores, entry]);
      safeLocalStorage.set(LAST_RESULT_KEY, {
        ...entry,
        durationLabel: formatElapsed(totalMs),
      });
      router.push("/clear");
    }
  };

  return (
    <div className="wood-bg min-h-screen p-6 text-amber-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <RetroPanel className="flex flex-wrap items-center justify-between gap-4">
          <div className="retro-title text-xl">타자 연습 진행 중</div>
          <div className="flex items-center gap-3 text-sm">
            <RetroButton variant="secondary" onClick={() => setSettingsOpen(true)}>
              ⚙ 설정
            </RetroButton>
            <RetroButton
              variant="secondary"
              onClick={() => {
                router.push("/");
              }}
            >
              나가기
            </RetroButton>
          </div>
        </RetroPanel>

        <GamePanel className="flex flex-col">
          <div className="flex">
            <GameSection
              className="w-full h-full rounded-2xl game-border"
              onClick={() => {
                textareaRef.current?.focus();
              }}
            >
              <TypingPanel inputText={displayText} />
              <textarea
                ref={textareaRef}
                className="absolute h-0 w-0 opacity-0"
                onChange={(event) => {
                  const next = (event.target as HTMLTextAreaElement).value;
                  setRawValue(next);
                  if (isComposing) return;
                  handleInput(next);
                }}
                onCompositionStart={() => {
                  setIsComposing(true);
                  setComposingTail("");
                }}
                onCompositionUpdate={() => {
                  if (composeFrameRef.current) {
                    cancelAnimationFrame(composeFrameRef.current);
                  }
                  composeFrameRef.current = requestAnimationFrame(() => {
                    const next = textareaRef.current?.value ?? "";
                    const composed = next.startsWith(inputText) ? next : `${inputText}${next}`;
                    const tail = composed.slice(inputText.length);
                    setComposingTail(tail);
                    setRawValue(composed);
                    composeFrameRef.current = null;
                  });
                }}
                onCompositionEnd={(event) => {
                  const next = (event.target as HTMLTextAreaElement).value;
                  const composed = next.startsWith(inputText) ? next : `${inputText}${next}`;
                  setIsComposing(false);
                  setComposingTail("");
                  setRawValue(composed);
                  if (textareaRef.current) {
                    textareaRef.current.value = composed;
                    textareaRef.current.setSelectionRange(composed.length, composed.length);
                  }
                  handleInput(composed);
                }}
                onKeyDown={(event) => {
                  if (
                    (event.key === "Backspace" || event.key === "Delete") &&
                    rawValue.length <= inputText.length
                  ) {
                    event.preventDefault();
                  }
                  if (event.code === "ShiftLeft") setShiftLeftCount((prev) => prev + 1);
                  if (event.code === "ShiftRight") setShiftRightCount((prev) => prev + 1);
                  if (event.key === "Enter") {
                    event.preventDefault();
                  }
                }}
              />
            </GameSection>
            <div className="flex flex-col min-w-36">
              <div className="m-3 rounded-md border border-[#8b6a45] bg-[#0c4b43] px-3 py-2 text-xs text-emerald-100">
                {nickname || "TEAM"}
              </div>
              <div className="flex h-32 items-center justify-center rounded-md border border-[#8b6a45] bg-white">
                <div className="text-xs text-amber-700">캐릭터</div>
              </div>
              <div>
                <div className="m-3 rounded-md border border-[#8b6a45] bg-[#0c4b43] px-3 py-3 text-center text-2xl font-semibold text-yellow-300">
                  {formatElapsed(elapsed).slice(0, 5)}
                </div>
                <div className="m-3 px-3 py-2 text-xs text-black">
                  주기도문
                </div>
                <div className="m-3 px-3 py-2 text-xs text-black">
                  {Math.max(1, Math.round(progress * 3))}쪽 / 3쪽
                </div>
              </div>
            </div>
          </div>
          <div className="m-3 rounded-md border border-[#8b6a45] bg-[#0c4b43] px-4 py-2 text-sm text-yellow-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-[90px]">타수: {cpm}타/분</div>
              <div className="flex-1">
                <div className="h-3 w-full rounded-sm bg-[#d9f4ff]">
                  <div
                    className="h-3 rounded-sm bg-[#7fd3ff]"
                    style={{ width: `${cpmRatio * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-[90px]">정확도: {accuracy}%</div>
              <div className="flex-1">
                <div className="h-3 w-full rounded-sm bg-white">
                  <div
                    className="h-3 rounded-sm bg-white"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </GamePanel>

      </div>

      {showShiftHint ? (
        <div className="fixed inset-x-0 top-6 z-40 mx-auto w-fit rounded-full bg-amber-200 px-6 py-2 text-sm font-semibold shadow-lg">
          SHIFT 사용하세요!
        </div>
      ) : null}
      {showLangHint ? (
        <div className="fixed inset-x-0 top-16 z-40 mx-auto w-fit rounded-full bg-rose-200 px-6 py-2 text-sm font-semibold shadow-lg">
          영문으로 되어있습니다. 한글로 바꾸세요!
        </div>
      ) : null}

      <SettingsModal
        open={settingsOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
