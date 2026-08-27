"use client";

import { useRouter } from "next/navigation";

import BackArrowIcon from "@/assets/icons/backArrow.svg";

/** 뒤로가기 + 가운데 타이틀로 구성된 상단 앱바. 스크롤해도 상단에 붙어 있는다. */
export function AppBar({ title }: { title: string }) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 border-b border-nav-border bg-surface pt-[env(safe-area-inset-top)]">
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
