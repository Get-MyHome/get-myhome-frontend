"use client";

import { useEffect, useState } from "react";

import Case1 from "@/assets/images/case1.svg";
import Case2 from "@/assets/images/case2.svg";
import { cn } from "@/utils/cn";

const CASES = [Case1, Case2];
const INTERVAL_MS = 2000;

// 마지막 장에서 첫 장으로 돌아갈 때도 같은 방향으로 넘어가게 첫 장을 뒤에 한 번 더 붙인다.
// 복제 슬라이드에 도착하면 transition 을 끄고 0 번으로 되돌려 이어붙인 자리를 감춘다.
const SLIDES = [...CASES, CASES[0]];

/** 예시 판정 리포트 이미지를 2초 간격으로 자동 순환한다. */
export function ExampleReportCarousel() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      timer ??= setInterval(() => {
        setAnimating(true);
        setIndex((current) => current + 1);
      }, INTERVAL_MS);
    };

    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };

    // 탭이 숨으면 브라우저가 CSS 트랜지션을 멈춰 transitionEnd 가 오지 않는다.
    // 그 사이 타이머만 계속 돌면 index 가 슬라이드 수를 넘어가 빈 칸만 남는다
    const syncWithVisibility = () => (document.hidden ? stop() : start());

    syncWithVisibility();
    document.addEventListener("visibilitychange", syncWithVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", syncWithVisibility);
    };
  }, []);

  const handleTransitionEnd = () => {
    // 한 번 밀려 넘어가도 되돌아오도록 등호 대신 >= 로 둔다
    if (index >= SLIDES.length - 1) {
      setAnimating(false);
      setIndex(0);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[400px] overflow-hidden">
      <div
        className={cn(
          "flex",
          animating && "transition-transform duration-500 ease-in-out"
        )}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {SLIDES.map((Slide, slideIndex) => (
          <div
            key={slideIndex}
            className="flex w-full shrink-0 items-center justify-center"
          >
            <Slide aria-hidden="true" className="block h-auto w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
