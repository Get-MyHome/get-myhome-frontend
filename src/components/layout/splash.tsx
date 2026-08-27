"use client";

import { useEffect, useState } from "react";

import LogoLockup from "@/assets/logoLockup.svg";

const SPLASH_DURATION_MS = 3000;

export function Splash() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white" aria-hidden="true">
      <div className="relative mx-auto h-full w-full max-w-app bg-splash">
        {/* 디자인(375x812) 기준 락업 중심은 y=371.5 → 화면 높이의 45.75% */}
        <LogoLockup className="absolute left-1/2 top-[45.75%] h-auto w-[287px] max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
