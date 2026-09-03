"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  EMPTY_CONDITIONS,
  type EligibilityConditions,
} from "@/types/eligibility";
import { CONDITIONS_STORAGE_KEY } from "@/constants/storage";
import { readSessionState, writeSessionState } from "@/utils/sessionState";

import { OptionalConditionFields } from "./optionalConditionFields";

/**
 * 2단계 정밀 입력. 대출 상품 화면의 [더 정확하게 알아보기]에서 진입한다.
 * 제출하면 대출 상품 화면으로 돌아가고, 그쪽이 확장된 조건으로 다시 조회한다.
 */
export function OptionalConditionForm() {
  const router = useRouter();
  const [conditions, setConditions] = useState<EligibilityConditions>(
    () =>
      readSessionState<EligibilityConditions>(CONDITIONS_STORAGE_KEY) ??
      EMPTY_CONDITIONS
  );

  useEffect(() => {
    if (conditions === EMPTY_CONDITIONS) return;
    writeSessionState(CONDITIONS_STORAGE_KEY, conditions);
  }, [conditions]);

  const updateField = useCallback(
    <Key extends keyof EligibilityConditions>(
      key: Key,
      value: EligibilityConditions[Key]
    ) => {
      setConditions((previous) => ({ ...previous, [key]: value }));
    },
    []
  );

  return (
    <form
      className="flex flex-1 flex-col gap-[20px] px-gutter pt-5 pb-[calc(env(safe-area-inset-bottom)+24px)]"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/eligibility/loans");
      }}
    >
      <OptionalConditionFields conditions={conditions} onChange={updateField} />

      <button
        type="submit"
        className="mt-auto flex h-[44px] w-full items-center justify-center rounded-[6px] bg-primary p-[10px] text-subtitle-4 font-bold text-white"
      >
        이 조건으로 다시 계산하기
      </button>
    </form>
  );
}
