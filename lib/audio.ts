const bgmSource = "/bgm/ccm.mp3";

const sfxSources = {
  keyboard: "/keyboard.wav",
  error: "/error.wav",
};

let activeSfx: HTMLAudioElement | null = null;
let bgmAudio: HTMLAudioElement | null = null;
let bgmGestureAttached = false;

const attachGesturePlay = (audio: HTMLAudioElement) => {
  if (typeof window === "undefined") return;
  const tryPlay = () => {
    audio
      .play()
      .then(() => {
        window.removeEventListener("pointerdown", tryPlay);
        window.removeEventListener("keydown", tryPlay);
        window.removeEventListener("touchstart", tryPlay);
      })
      .catch(() => {
        // Still blocked; keep listeners until a successful user gesture.
      });
  };
  window.addEventListener("pointerdown", tryPlay, { passive: true });
  window.addEventListener("keydown", tryPlay);
  window.addEventListener("touchstart", tryPlay, { passive: true });
};

const attachBgmGesturePlay = () => {
  if (typeof window === "undefined") return;
  if (bgmGestureAttached) return;
  bgmGestureAttached = true;
  const tryPlay = () => {
    if (!bgmAudio) return;
    bgmAudio
      .play()
      .then(() => {
        window.removeEventListener("pointerdown", tryPlay);
        window.removeEventListener("keydown", tryPlay);
        window.removeEventListener("touchstart", tryPlay);
        bgmGestureAttached = false;
      })
      .catch(() => {
        // Still blocked; keep listeners until a successful user gesture.
      });
  };
  window.addEventListener("pointerdown", tryPlay, { passive: true });
  window.addEventListener("keydown", tryPlay);
  window.addEventListener("touchstart", tryPlay, { passive: true });
};

const createOscillator = (frequency: number, duration = 0.15, gainValue = 0.08) => {
  if (typeof window === "undefined") return;
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.frequency.value = frequency;
  gain.gain.value = gainValue;
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
  oscillator.onended = () => ctx.close();
};

export const playSfx = (type: keyof typeof sfxSources) => {
  if (typeof window === "undefined") return;
  if (activeSfx) {
    activeSfx.pause();
    activeSfx.currentTime = 0;
  }
  const audio = new Audio(sfxSources[type]);
  audio.volume = type === "error" ? 0.45 : 0.35;
  activeSfx = audio;
  audio.onended = () => {
    if (activeSfx === audio) activeSfx = null;
  };
  audio.play().catch(() => {
    if (activeSfx === audio) activeSfx = null;
    createOscillator(type === "error" ? 120 : 240, type === "error" ? 0.2 : 0.12);
  });
};

export const startBgm = (volume = 0.4) => {
  if (typeof window === "undefined") return null;
  if (!bgmAudio) {
    bgmAudio = new Audio(bgmSource);
    bgmAudio.loop = true;
  }
  bgmAudio.volume = volume;
  bgmAudio.play().catch(() => {
    attachBgmGesturePlay();
  });
  return bgmAudio;
};

export const stopBgm = () => {
  if (!bgmAudio) return;
  bgmAudio.pause();
  bgmAudio.currentTime = 0;
};
