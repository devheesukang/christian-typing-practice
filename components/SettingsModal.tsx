"use client";

import RetroButton from "./RetroButton";
import type { SettingsState } from "@/lib/types";

type Props = {
  open: boolean;
  settings: SettingsState;
  onClose: () => void;
  onChange: (next: SettingsState) => void;
  showPrayerVersion?: boolean;
};

export default function SettingsModal({
  open,
  settings,
  onClose,
  onChange,
  showPrayerVersion = false,
}: Props) {
  if (!open) return null;

  const update = (patch: Partial<SettingsState>) => {
    onChange({ ...settings, ...patch });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="retro-panel-light w-full max-w-lg rounded-2xl p-6">
        <div className="retro-title mb-4 text-xl text-amber-900">환경 설정</div>
        <div className="space-y-5 text-sm text-amber-900">
          <div>
            <div className="mb-2 font-semibold">BGM</div>
            <div className="flex flex-wrap gap-2">
              <RetroButton
                type="button"
                variant={settings.bgmEnabled ? "primary" : "secondary"}
                className={settings.bgmEnabled ? "is-selected" : ""}
                aria-pressed={settings.bgmEnabled}
                onClick={() => update({ bgmEnabled: true })}
              >
                ON
              </RetroButton>
              <RetroButton
                type="button"
                variant={!settings.bgmEnabled ? "primary" : "secondary"}
                className={!settings.bgmEnabled ? "is-selected" : ""}
                aria-pressed={!settings.bgmEnabled}
                onClick={() => update({ bgmEnabled: false })}
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
                onClick={() => update({ sfxEnabled: true })}
              >
                ON
              </RetroButton>
              <RetroButton
                type="button"
                variant={!settings.sfxEnabled ? "primary" : "secondary"}
                className={!settings.sfxEnabled ? "is-selected" : ""}
                aria-pressed={!settings.sfxEnabled}
                onClick={() => update({ sfxEnabled: false })}
              >
                OFF
              </RetroButton>
            </div>
          </div>
          {showPrayerVersion ? (
            <div>
              <div className="mb-2 font-semibold">주기도문 버전</div>
              <div className="flex gap-2">
                <RetroButton
                  type="button"
                  variant={settings.prayerVersion === "new" ? "primary" : "secondary"}
                  className={settings.prayerVersion === "new" ? "is-selected" : ""}
                  aria-pressed={settings.prayerVersion === "new"}
                  onClick={() => update({ prayerVersion: "new" })}
                >
                  새
                </RetroButton>
                <RetroButton
                  type="button"
                  variant={settings.prayerVersion === "classic" ? "primary" : "secondary"}
                  className={settings.prayerVersion === "classic" ? "is-selected" : ""}
                  aria-pressed={settings.prayerVersion === "classic"}
                  onClick={() => update({ prayerVersion: "classic" })}
                >
                  개역
                </RetroButton>
              </div>
            </div>
          ) : null}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <RetroButton type="button" onClick={onClose}>
            확인
          </RetroButton>
        </div>
      </div>
    </div>
  );
}
