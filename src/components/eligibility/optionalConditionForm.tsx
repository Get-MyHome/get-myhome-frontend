"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  EMPTY_CONDITIONS,
  type EligibilityConditions,
} from "@/types/eligibility";
import { CONDITIONS_STORAGE_KEY } from "@/constants/storage";
import { cn } from "@/utils/cn";
import { hasIncompleteGate } from "@/utils/conditionProgress";
import {
  readSessionState,
  useDiscardOnLeave,
  writeSessionState,
} from "@/utils/sessionState";

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

  // "예" 로 열어둔 하위 입력칸이 비어 있으면 제출을 막는다
  const blocked = hasIncompleteGate(conditions);

  return (
    <form
      className="flex flex-1 flex-col gap-[20px] px-gutter pt-5 pb-[calc(env(safe-area-inset-bottom)+24px)]"
      onSubmit={(event) => {
        event.preventDefault();
        commit();
        router.push("/eligibility/loans");
      }}
    >
      <OptionalConditionFields conditions={conditions} onChange={updateField} />

      <div className="mt-auto flex flex-col gap-[8px]">
        {blocked && (
          <p className="text-body-3 font-medium text-danger">
            &quot;예&quot;로 답한 항목의 세부 값을 모두 입력해주세요.
          </p>
        )}
        <button
          type="submit"
          disabled={blocked}
          className={cn(
            "flex h-[44px] w-full cursor-pointer items-center justify-center rounded-[6px] p-[10px]",
            "text-subtitle-4 font-bold text-white",
            "disabled:cursor-not-allowed",
            blocked ? "bg-primary-400" : "bg-primary"
          )}
        >
          이 조건으로 다시 계산하기
        </button>
      </div>
    </form>
  );
}
