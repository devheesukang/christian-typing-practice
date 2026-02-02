export const SETTINGS_KEY = "winter-retreat-typing-settings-v1";
export const SCORES_KEY = "winter-retreat-typing-scores-v1";
export const LAST_RESULT_KEY = "winter-retreat-typing-last-result-v1";
export const NICKNAME_KEY = "winter-retreat-typing-nickname-v1";

export const safeLocalStorage = {
  get<T>(key: string, fallback: T) {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors
    }
  },
  remove(key: string) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore remove errors
    }
  },
};
