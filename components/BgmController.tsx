"use client";

import { useEffect } from "react";
import { useAppContext } from "@/state/AppContext";
import { startBgm, stopBgm } from "@/lib/audio";

export default function BgmController() {
  const { settings } = useAppContext();

  useEffect(() => {
    if (!settings.bgmEnabled) {
      stopBgm();
      return;
    }
    startBgm(0.3);
    return () => {
      stopBgm();
    };
  }, [settings.bgmEnabled]);

  return null;
}
