const PUNCTUATION_REGEX = /[,.]/g;
const NEWLINE_REGEX = /[\r\n]+/g;

export const normalizePrayerText = (text: string) =>
  text.replace(PUNCTUATION_REGEX, "").replace(NEWLINE_REGEX, " ").replace(/\s+/g, " ").trim();

export const formatElapsed = (ms: number) => {
  const clamped = Math.max(0, ms);
  const minutes = Math.floor(clamped / 60000);
  const seconds = Math.floor((clamped % 60000) / 1000);
  const millis = Math.floor(clamped % 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(
    millis
  ).padStart(3, "0")}`;
};

export const makeTeamNickname = () => {
  const suffix = Math.floor(100 + Math.random() * 900);
  return `TEAM-${suffix}`;
};

export const clampTextInput = (value: string) =>
  value.replace(PUNCTUATION_REGEX, "").replace(/\r?\n/g, "");
