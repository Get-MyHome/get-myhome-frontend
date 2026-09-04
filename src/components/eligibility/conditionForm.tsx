"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  EMPTY_CONDITIONS,
  isRequiredComplete,
  type EligibilityConditions,
} from "@/types/eligibility";
import { cn } from "@/utils/cn";
import { CONDITIONS_STORAGE_KEY } from "@/constants/storage";
import {
  readSessionState,
  useDiscardOnLeave,
  writeSessionState,
} from "@/utils/sessionState";

import { RequiredConditionFields } from "./requiredConditionFields";

/**
 * 1단계 — 필수 5개(+전세보증금 선택). 제출하면 대출 상품 화면으로.
 * 2단계(정밀 입력)는 대출 상품 화면의 [더 정확하게 알아보기]에서 별도 페이지로 받는다.
 */
export function ConditionForm() {
  const router = useRouter();
  const [conditions, setConditions] = useState<EligibilityConditions>(
    () => readSessionState<EligibilityConditions>(CONDITIONS_STORAGE_KEY) ?? EMPTY_CONDITIONS
  );

  useEffect(() => {
    if (conditions === EMPTY_CONDITIONS) return;
    writeSessionState(CONDITIONS_STORAGE_KEY, conditions);
  }, [conditions]);

  // 다음 단계로 넘기지 않고 화면을 떠나면 들어올 때 값으로 되돌린다
  const { commit } = useDiscardOnLeave(CONDITIONS_STORAGE_KEY);

  const updateField = useCallback(
    <Key extends keyof EligibilityConditions>(
      key: Key,
      value: EligibilityConditions[Key]
    ) => {
      setConditions((previous) => ({ ...previous, [key]: value }));
    },
    []
  );

  const submittable = isRequiredComplete(conditions);

  return (
    <form
      className="flex flex-1 flex-col gap-[20px] px-gutter pt-5 pb-[calc(env(safe-area-inset-bottom)+24px)]"
      onSubmit={(event) => {
        event.preventDefault();
        commit();
        router.push("/eligibility/loans");
      }}
    >
      <RequiredConditionFields conditions={conditions} onChange={updateField} />

      <button
        type="submit"
        disabled={!submittable}
        className={cn(
          "mt-auto flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[6px] p-[10px]",
          "text-subtitle-4 font-bold text-white",
          "disabled:cursor-not-allowed",
          submittable ? "bg-primary" : "bg-primary-400"
        )}
      >
        다음
      </button>
    </form>
  );
}
