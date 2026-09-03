"use client";

import { useState } from "react";

import CheckboxRoundIcon from "@/assets/icons/checkboxRound.svg";
import { BottomSheet } from "@/components/ui/bottomSheet";
import { cn } from "@/utils/cn";

/**
 * 개인정보 처리방침 전문. 정식 법무 검수·디자인(Figma 14:1097 "약관 내용")이
 * 나오기 전까지 쓰는 임시 카피 — 서비스에서 이미 쓰고 있는 문구를 최대한 재사용했다.
 * 정식 버전이 나오면 이 상수를 교체한다.
 */
const PRIVACY_POLICY_TEXT = `1. 수집하는 개인정보 항목
청약 자금 판정을 위해 입력하신 소득·자산 정보, 판정 결과를 이메일로 받기로 동의하신 경우의 이메일 주소를 수집합니다.

2. 개인정보의 수집 및 이용 목적
입력하신 정보는 청약을 감당할 수 있는지 판정하는 용도로만 사용되며, 그 외의 목적으로 이용되지 않습니다.

3. 개인정보의 보유 및 이용 기간
비로그인 상태에서는 입력하신 정보가 서버에 영구 저장되지 않습니다. 이메일 주소는 판정 결과 발송 목적으로만 사용되며, 발송 후 지체 없이 파기됩니다.

4. 개인정보의 제3자 제공
입력하신 정보는 제3자에게 제공되지 않습니다.

5. 문의처
개인정보 처리에 관한 문의처는 추후 안내드릴 예정입니다.`;

/**
 * 판정 결과 [내용 받기] → 이메일 발송 전 동의 시트 (Figma 14:1132).
 * 약관 전문(14:1097 "약관 내용")은 아직 미구현 — [보기] 는 개인정보 처리방침만 보여준다.
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
  const [showPolicy, setShowPolicy] = useState(false);

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
            onClick={() => setShowPolicy(true)}
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

      <BottomSheet
        open={showPolicy}
        onClose={() => setShowPolicy(false)}
        title="개인정보 처리방침"
      >
        <p className="max-h-[60vh] overflow-y-auto whitespace-pre-line text-body-3 font-medium text-neutral-400">
          {PRIVACY_POLICY_TEXT}
        </p>
      </BottomSheet>
    </BottomSheet>
  );
}
