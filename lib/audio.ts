const bgmSource = "/bgm/ccm.mp3";

const sfxSources = {
  keyboard: "/keyboard.wav",
  error: "/error.wav",
};

let activeSfx: HTMLAudioElement | null = null;

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
  const audio = new Audio(bgmSource);
  audio.loop = true;
  audio.volume = volume;
  audio.play().catch(() => {
    createOscillator(200, 0.2, 0.02);
  });
  return audio;
};
