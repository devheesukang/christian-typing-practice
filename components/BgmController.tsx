"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/state/AppContext";
import { startBgm } from "@/lib/audio";

export default function BgmController() {
  const { settings } = useAppContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!settings.bgmEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }
    audioRef.current?.pause();
    audioRef.current = startBgm(0.3);
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [settings.bgmEnabled]);

  return null;
}
