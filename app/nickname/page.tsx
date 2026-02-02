"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RetroPanel from "@/components/RetroPanel";
import RetroButton from "@/components/RetroButton";
import { makeTeamNickname } from "@/lib/typing";
import { useAppContext } from "@/state/AppContext";

export default function NicknamePage() {
  const router = useRouter();
  const { nickname, setNickname } = useAppContext();
  const [value, setValue] = useState(nickname || makeTeamNickname());

  useEffect(() => {
    if (!nickname) return;
    setValue(nickname);
  }, [nickname]);

  return (
    <div className="wood-bg min-h-screen p-6 text-amber-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <RetroPanel title="닉네임 입력">
          <div className="space-y-4">
            <div className="text-sm text-amber-800">
              2명이 함께 사용하는 팀 닉네임을 입력하세요.
            </div>
            <input
              className="w-full rounded-lg border-2 border-amber-300 bg-white/80 px-4 py-3 text-lg"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="매듭 회장단"
            />
            <div className="flex flex-wrap gap-3">
              <RetroButton
                onClick={() => {
                  const next = value.trim() || makeTeamNickname();
                  setNickname(next);
                  router.push("/game");
                }}
              >
                확인
              </RetroButton>
              <RetroButton variant="secondary" onClick={() => router.push("/")}>
                돌아가기
              </RetroButton>
            </div>
          </div>
        </RetroPanel>
      </div>
    </div>
  );
}
