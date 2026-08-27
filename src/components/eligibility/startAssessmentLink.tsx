"use client";

import Link from "next/link";

import ArrowIcon from "@/assets/icons/arrow.svg";
import { CONDITIONS_STORAGE_KEY } from "@/constants/storage";
import { clearSessionState } from "@/utils/sessionState";

/**
 * 판정 플로우 진입 버튼.
 * 홈에서 새로 시작하는 것이므로 이전에 입력해 둔 조건을 비운다.
 * 플로우 안에서 뒤로 가는 경우에는 지우지 않으므로 입력값이 남는다.
 */
export function StartAssessmentLink() {
  return (
    <Link
      href="/eligibility"
      onClick={() => clearSessionState(CONDITIONS_STORAGE_KEY)}
      className="flex w-full items-center justify-center gap-[6px] rounded-[6px] bg-primary p-[10px]"
    >
      <span className="text-subtitle-4 font-bold text-primary-foreground">
        가능성 판정하기
      </span>
      {/* 에셋은 위를 향하는 화살표다. 디자인대로 90도 돌려 오른쪽을 향하게 한다 */}
      <ArrowIcon className="size-6 rotate-90" />
    </Link>
  );
}
