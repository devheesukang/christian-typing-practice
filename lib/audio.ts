type BgmTrack = "CCM" | "Mario";

const bgmSources: Record<BgmTrack, string> = {
  CCM: "/bgm/ccm.mp3",
  Mario: "/bgm/mario.mp3",
};

const sfxSources = {
  error: "/sfx/error.wav",
  carve: "/sfx/carve.wav",
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
  const audio = new Audio(sfxSources[type]);
  audio.volume = type === "error" ? 0.4 : 0.5;
  audio.play().catch(() => {
    createOscillator(type === "error" ? 120 : 240, type === "error" ? 0.2 : 0.12);
  });
};

export const startBgm = (track: BgmTrack, volume = 0.4) => {
  if (typeof window === "undefined") return null;
  const audio = new Audio(bgmSources[track]);
  audio.loop = true;
  audio.volume = volume;
  audio.play().catch(() => {
    createOscillator(200, 0.2, 0.02);
  });
  return audio;
};
