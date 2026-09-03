"use client";

import { useEffect, useState } from "react";

import SplashGlowLarge from "@/assets/splashGlowLarge.svg";
import SplashGlowSmall from "@/assets/splashGlowSmall.svg";
import SplashHouse from "@/assets/splashHouse.svg";
import { cn } from "@/utils/cn";

const VISIBLE_MS = 2000;
const FADE_MS = 250;

/**
 * 진입 스플래시 (Figma 2019:515). 세션당 첫 진입에만 뜬다.
 *
 * "이미 봤는지" 판정은 이 컴포넌트가 하지 않는다. 서버가 그린 HTML 은
 * 하이드레이션 전에 이미 화면에 뜨기 때문에, 리액트가 지우는 방식으로는
 * 새로고침 때 깜빡임을 막을 수 없다. 그래서 layout 의 페인트 전 스크립트가
 * html 에 data-splash-seen 을 붙이고 CSS 가 감춘다. 여기서는 노출 시간과
 * 페이드만 맡고, 감춰진 경우에도 같은 시각에 조용히 사라진다.
 *
 * 배경 글로우와 집 아이콘은 디자인에서 내보낸 SVG 를 그대로 쓰고, 위치는
 * 디자인 프레임(375x812) 좌표를 폭 기준 비율로 옮겼다. 흐림 여백까지 포함한
 * 글로우 박스는 프레임 밖으로 나가므로 컨테이너에서 잘라낸다.
 */
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

  return (
    <div
      id="splash"
      aria-hidden="true"
      // 페이드가 시작되면 클릭을 통과시킨다. 타이머가 밀려도 화면을 막지 않는다
      className={cn(
        "fixed inset-0 z-50 bg-white transition-opacity motion-reduce:transition-none",
        phase === "fading" && "pointer-events-none opacity-0"
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="relative mx-auto h-full w-full max-w-app overflow-hidden bg-splash text-primary">
        <span className="absolute top-[30.5%] left-[-97.6%] block aspect-square w-[174.7%]">
          <SplashGlowLarge className="h-full w-full" />
        </span>
        <span className="absolute top-[-4.3%] left-[38.1%] block aspect-square w-[115%]">
          <SplashGlowSmall className="h-full w-full" />
        </span>

        {/* 로고 락업 중심은 디자인 기준 y=373.75 → 화면 높이의 46% */}
        <div className="absolute top-[46%] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[11px]">
          <div className="flex flex-col items-center gap-[16px]">
            <span className="relative block h-[60.5px] w-[66.5px]">
              <SplashHouse className="absolute inset-[-8.39%_-6.02%_-6.61%_-6.02%]" />
              {/* 위치는 바깥 span 이, 튕김은 안쪽 span 이 맡는다 — transform 충돌 방지 */}
              <span className="absolute top-[34%] left-[46%] -translate-x-1/2">
                <span className="block animate-question-bounce text-heading-1 leading-none font-bold motion-reduce:animate-none">
                  ?
                </span>
              </span>
            </span>
            <p className="text-heading-2 leading-none font-bold whitespace-nowrap">
              Homm, 살 수 있어?
            </p>
          </div>
          <p className="text-body-2 font-medium whitespace-nowrap">
            청년의 주택 구매 자금 가능성을 판정해드려요.
          </p>
        </div>
      </div>
    </div>
  );
}
