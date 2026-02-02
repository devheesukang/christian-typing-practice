const PUNCTUATION_REGEX = /[,.]/g;
const NEWLINE_REGEX = /[\r\n]+/g;
const PUNCTUATION_SET = new Set([",", "."]);

export const buildDisplayText = (
  original: string,
  typedCount: number,
  includeAutoPunct = true
) => {
  const normalizedOriginal = original.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  let display = "";
  let normCount = 0;
  let prevSpace = false;

  for (const char of normalizedOriginal) {
    const isPunct = PUNCTUATION_SET.has(char);
    const isNewline = char === "\n";
    const isSpace = char === " " || char === "\t";

    if (isPunct) {
      if (normCount < typedCount || (includeAutoPunct && normCount === typedCount)) {
        display += char;
        continue;
      }
      break;
    }

    if (isNewline || isSpace) {
      if (prevSpace) {
        if (normCount < typedCount) {
          display += isNewline ? "\n" : " ";
        }
        continue;
      }
      if (normCount < typedCount) {
        display += isNewline ? "\n" : " ";
        normCount += 1;
        prevSpace = true;
        continue;
      }
      break;
    }

    if (normCount < typedCount) {
      display += char;
      normCount += 1;
      prevSpace = false;
      continue;
    }
    break;
  }

  return display;
};

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
