"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RetroPanel from "@/components/RetroPanel";
import RetroButton from "@/components/RetroButton";
import SettingsModal from "@/components/SettingsModal";
import { PRAYER_DESCRIPTIONS, PRAYER_TITLES, type PrayerVersion } from "@/lib/prayers";
import { useAppContext } from "@/state/AppContext";

export default function Home() {
  const router = useRouter();
  const { settings, setSettings } = useAppContext();
  const [selected, setSelected] = useState<PrayerVersion>("new");
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="retro-wood min-h-screen p-6 text-amber-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="retro-panel flex items-center justify-between rounded-2xl p-4">
          <div className="retro-title text-2xl">주기도문 타자연습</div>
          <div className="text-xs text-amber-800">협업 타자 모드</div>
        </header>

        <main className="grid gap-4 md:grid-cols-[220px_1fr_260px]">
          <RetroPanel title="메뉴" className="flex flex-col gap-3">
            <RetroButton onClick={() => router.push("/nickname")}>연습 시작</RetroButton>
            <RetroButton onClick={() => router.push("/ranking")}>기록 보기</RetroButton>
            <RetroButton onClick={() => setSettingsOpen(true)}>환경 설정</RetroButton>
            <RetroButton
              variant="secondary"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.close();
                  router.push("/");
                }
              }}
            >
              종료
            </RetroButton>
          </RetroPanel>

          <RetroPanel title="연습 목록" className="min-h-[360px]">
            <div className="space-y-3 text-sm">
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
            </div>
          </RetroPanel>

          <RetroPanel title="설명">
            <div className="space-y-3 text-sm leading-relaxed text-amber-900">
              <div className="text-base font-semibold">{PRAYER_TITLES[selected]}</div>
              <p>{PRAYER_DESCRIPTIONS[selected]}</p>
              <p className="text-xs text-amber-700">
                쉼표와 마침표는 입력하지 않습니다. Enter 없이 공백을 입력하세요.
              </p>
              <RetroButton
                className="mt-4 w-full"
                onClick={() => {
                  setSettings({ ...settings, prayerVersion: selected });
                  router.push("/nickname");
                }}
              >
                선택하고 시작
              </RetroButton>
            </div>
          </RetroPanel>
        </main>
      </div>

      <SettingsModal
        open={settingsOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
