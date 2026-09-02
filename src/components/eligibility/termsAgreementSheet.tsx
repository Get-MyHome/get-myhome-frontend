"use client";

import { useState } from "react";

import CheckboxRoundIcon from "@/assets/icons/checkboxRound.svg";
import { BottomSheet } from "@/components/ui/bottomSheet";
import { cn } from "@/utils/cn";

/**
 * 판정 결과 [내용 받기] → 이메일 발송 전 동의 시트 (Figma 14:1132).
 * 약관 전문(14:1097 "약관 내용")은 아직 미구현 — [보기] 는 자리만 있다.
 */
export function TermsAgreementSheet({
  open,
  onClose,
  onAgree,
}: {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
}) {
  const [agreed, setAgreed] = useState(false);

  return (
    <BottomSheet open={open} onClose={onClose} title="서비스 동의">
      <div className="flex flex-col items-center gap-[12px]">
        <div className="flex w-full items-center justify-between rounded-[41px] bg-primary-50 p-[14px]">
          <button
            type="button"
            onClick={() => setAgreed((v) => !v)}
            aria-pressed={agreed}
            className="flex items-center gap-[6px] text-body-2 font-bold text-foreground"
          >
            <span
              className={cn(
                "flex size-[18px] shrink-0 items-center justify-center rounded-[2px] border",
                agreed
                  ? "border-primary text-primary"
                  : "border-neutral-300 bg-surface"
              )}
            >
              {agreed && (
                <CheckboxRoundIcon aria-hidden="true" className="size-[18px]" />
              )}
            </span>
            서비스 약관 및 개인정보 처리동의
          </button>
          <button
            type="button"
            className="shrink-0 text-body-2 font-medium text-neutral-300 underline"
          >
            보기
          </button>
        </div>

        <p className="whitespace-pre-line text-center text-body-2 font-medium text-neutral-400">
          {"입력하신 정보는 청약 자금 판정에만 사용되며,\n비로그인 상태에서는 영구 저장되지 않습니다."}
        </p>

        <button
          type="button"
          disabled={!agreed}
          onClick={onAgree}
          className={cn(
            "flex h-[44px] w-full items-center justify-center rounded-[6px] p-[10px] text-subtitle-4 font-bold text-white",
            agreed ? "bg-primary" : "bg-primary-400"
          )}
        >
          동의하고 결과 내용 받기
        </button>
      </div>
    </BottomSheet>
  );
}
