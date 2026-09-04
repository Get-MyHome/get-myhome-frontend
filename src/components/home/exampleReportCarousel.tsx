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

/** 예시 판정 리포트 이미지를 3초 간격으로 자동 순환한다. */
export function ExampleReportCarousel() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setIndex((current) => current + 1);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    if (index === SLIDES.length - 1) {
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
