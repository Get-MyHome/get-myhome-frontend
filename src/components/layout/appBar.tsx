"use client";

import { useRouter } from "next/navigation";

import BackArrowIcon from "@/assets/icons/backArrow.svg";
import { cn } from "@/utils/cn";

/**
 * 뒤로가기 + 가운데 타이틀로 구성된 상단 앱바. 스크롤해도 상단에 붙어 있는다.
 * 바로 아래에 프로그래스 바처럼 경계 역할을 겸하는 요소가 붙는 화면은
 * borderless 로 밑줄을 빼야 회색 선이 두 겹으로 보이지 않는다.
 */
export function AppBar({
  title,
  borderless = false,
}: {
  title: string;
  borderless?: boolean;
}) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 bg-surface pt-[env(safe-area-inset-top)]",
        !borderless && "border-b border-nav-border"
      )}
    >
      <div className="relative flex h-14 items-center justify-center">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="absolute left-[17px] flex size-6 items-center justify-center"
        >
          <BackArrowIcon className="h-4 w-[22px]" />
        </button>
        <h1 className="text-subtitle-3 font-medium tracking-[-0.2px] text-nav-text">
          {title}
        </h1>
      </div>
    </header>
  );
}
