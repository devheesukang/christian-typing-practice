import type { PrayerVersion } from "./prayers";

export type SettingsState = {
  bgmEnabled: boolean;
  bgmTrack: "CCM" | "Mario";
  prayerVersion: PrayerVersion;
};

export type ScoreEntry = {
  id: string;
  nickname: string;
  timeMs: number;
  createdAt: string;
  wrongCount: number;
  shiftLeft: number;
  shiftRight: number;
  prayerVersion: PrayerVersion;
};

export type GameResult = ScoreEntry & {
  durationLabel: string;
};
