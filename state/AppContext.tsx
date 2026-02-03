"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { safeLocalStorage, SETTINGS_KEY, NICKNAME_KEY } from "@/lib/storage";
import type { SettingsState } from "@/lib/types";

type AppContextValue = {
  settings: SettingsState;
  setSettings: (next: SettingsState) => void;
  nickname: string;
  setNickname: (next: string) => void;
};

const defaultSettings: SettingsState = {
  bgmEnabled: true,
  sfxEnabled: true,
  prayerVersion: "new",
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettingsState] = useState<SettingsState>(defaultSettings);
  const [nickname, setNicknameState] = useState("");

  useEffect(() => {
    const stored = safeLocalStorage.get(SETTINGS_KEY, defaultSettings);
    const migrated = {
      ...stored,
      sfxEnabled:
        typeof stored.sfxEnabled === "boolean"
          ? stored.sfxEnabled
          : Boolean(stored.keyboardSfxEnabled ?? stored.errorSfxEnabled ?? true),
    };
    setSettingsState({ ...defaultSettings, ...migrated });
    setNicknameState(safeLocalStorage.get(NICKNAME_KEY, ""));
  }, []);

  useEffect(() => {
    safeLocalStorage.set(SETTINGS_KEY, settings);
  }, [settings]);

  useEffect(() => {
    if (!nickname) return;
    safeLocalStorage.set(NICKNAME_KEY, nickname);
  }, [nickname]);

  const value = useMemo(
    () => ({
      settings,
      setSettings: setSettingsState,
      nickname,
      setNickname: setNicknameState,
    }),
    [settings, nickname]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return ctx;
};
