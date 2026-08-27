"use client";

import { useEffect, useState } from "react";

import LogoLockup from "@/assets/logoLockup.svg";
import { cn } from "@/utils/cn";

const VISIBLE_MS = 1000;
const FADE_MS = 250;

export function Splash() {
  const [phase, setPhase] = useState<"visible" | "fading" | "done">("visible");

  useEffect(() => {
    const toFading = setTimeout(() => setPhase("fading"), VISIBLE_MS);
    const toDone = setTimeout(() => setPhase("done"), VISIBLE_MS + FADE_MS);

    return () => {
      clearTimeout(toFading);
      clearTimeout(toDone);
    };
  }, []);

  if (phase === "done") return null;

  const fading = phase === "fading";

  return (
    <div
      aria-hidden="true"
      // 페이드가 시작되면 클릭을 통과시킨다. 전환이 끝나기를 기다릴 필요가 없고,
      // 혹시 타이머가 밀려도 투명한 오버레이가 화면을 막는 일이 없다.
      className={cn(
        "fixed inset-0 z-50 bg-white transition-opacity motion-reduce:transition-none",
        fading && "pointer-events-none opacity-0",
      )}
      // 제거 타이머와 같은 값을 쓰도록 상수에서 직접 가져온다
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="relative mx-auto h-full w-full max-w-app bg-splash">
        {/* 디자인(375x812) 기준 락업 중심은 y=371.5 → 화면 높이의 45.75% */}
        <LogoLockup className="absolute top-[45.75%] left-1/2 h-auto w-[287px] max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
