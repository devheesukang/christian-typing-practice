"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RetroPanel from "@/components/RetroPanel";
import RetroButton from "@/components/RetroButton";
import SettingsModal from "@/components/SettingsModal";
import ShiftIndicator from "@/components/ShiftIndicator";
import TypingPanel from "@/components/TypingPanel";
import { PRAYER_TEXTS } from "@/lib/prayers";
import { normalizePrayerText, formatElapsed, clampTextInput } from "@/lib/typing";
import { playSfx, startBgm } from "@/lib/audio";
import { safeLocalStorage, SCORES_KEY, LAST_RESULT_KEY } from "@/lib/storage";
import type { ScoreEntry } from "@/lib/types";
import { useAppContext } from "@/state/AppContext";

export default function GamePage() {
  const router = useRouter();
  const { nickname, settings, setSettings } = useAppContext();
  const [inputText, setInputText] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shiftLeftActive, setShiftLeftActive] = useState(false);
  const [shiftRightActive, setShiftRightActive] = useState(false);
  const [shiftLeftCount, setShiftLeftCount] = useState(0);
  const [shiftRightCount, setShiftRightCount] = useState(0);
  const [showShiftHint, setShowShiftHint] = useState(false);
  const [hasShiftHinted, setHasShiftHinted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const targetText = useMemo(
    () => normalizePrayerText(PRAYER_TEXTS[settings.prayerVersion]),
    [settings.prayerVersion]
  );
  const progress = Math.min(inputText.length / targetText.length, 1);

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

  const handleInput = (nextValue: string) => {
    if (completed) return;
    const cleaned = clampTextInput(nextValue);
    if (cleaned.length < inputText.length) {
      setInputText(cleaned);
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
    <div className="retro-wood min-h-screen p-6 text-amber-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <RetroPanel className="flex flex-wrap items-center justify-between gap-4">
          <div className="retro-title text-xl">타자 연습 진행 중</div>
          <div className="flex items-center gap-4 text-sm">
            <div>타이머: {formatElapsed(elapsed)}</div>
            <div>진행률: {Math.round(progress * 100)}%</div>
            <RetroButton variant="secondary" onClick={() => setSettingsOpen(true)}>
              ⚙ 설정
            </RetroButton>
          </div>
        </RetroPanel>

        <RetroPanel
          title="연습 창"
          onClick={() => {
            textareaRef.current?.focus();
          }}
        >
          <TypingPanel inputText={inputText} />
          <textarea
            ref={textareaRef}
            className="absolute h-0 w-0 opacity-0"
            value={inputText}
            onInput={(event) =>
              handleInput((event.target as HTMLTextAreaElement).value)
            }
            onKeyDown={(event) => {
              if (event.code === "ShiftLeft") {
                setShiftLeftActive(true);
                setShiftLeftCount((prev) => prev + 1);
              }
              if (event.code === "ShiftRight") {
                setShiftRightActive(true);
                setShiftRightCount((prev) => prev + 1);
              }
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}
            onKeyUp={(event) => {
              if (event.code === "ShiftLeft") setShiftLeftActive(false);
              if (event.code === "ShiftRight") setShiftRightActive(false);
            }}
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div>오타: {wrongCount}</div>
            <div className="text-xs text-amber-700">
              입력된 글자만 표시됩니다. 쉼표/마침표는 자동 처리.
            </div>
          </div>
        </RetroPanel>

        <RetroPanel title="손가락 가이드">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm">
              왼손: A S D F / 오른손: J K L ;
            </div>
            <ShiftIndicator
              leftActive={shiftLeftActive}
              rightActive={shiftRightActive}
              leftCount={shiftLeftCount}
              rightCount={shiftRightCount}
            />
          </div>
        </RetroPanel>
      </div>

      {showShiftHint ? (
        <div className="fixed inset-x-0 top-6 z-40 mx-auto w-fit rounded-full bg-amber-200 px-6 py-2 text-sm font-semibold shadow-lg">
          SHIFT 사용하세요!
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
