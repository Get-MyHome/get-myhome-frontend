"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import ChevronIcon from "@/assets/icons/chevronRight.svg";
import {
  EMPTY_CONDITIONS,
  isRequiredComplete,
  type EligibilityConditions,
} from "@/types/eligibility";
import { cn } from "@/utils/cn";
import { CONDITIONS_STORAGE_KEY } from "@/constants/storage";
import { readSessionState, writeSessionState } from "@/utils/sessionState";

import { OptionalConditionFields } from "./optionalConditionFields";
import { RequiredConditionFields } from "./requiredConditionFields";

/**
 * 첫 렌더에서 한 번만 읽는다. 2단계에 값이 남아 있었다면 접힌 채로 감추지 않는다.
 * 서버에서는 sessionStorage 접근이 실패해 항상 빈 값이 되고,
 * 클라이언트 첫 렌더에서 저장값으로 채워진다.
 */
function restoreConditions() {
  const saved = readSessionState<EligibilityConditions>(CONDITIONS_STORAGE_KEY);

  return {
    conditions: saved ?? EMPTY_CONDITIONS,
    optionalOpen: Boolean(
      saved && (saved.monthlySaving || saved.householdRole || saved.netWorth)
    ),
  };
}

export function ConditionForm() {
  const router = useRouter();
  const [restored] = useState(restoreConditions);
  const [conditions, setConditions] = useState<EligibilityConditions>(
    restored.conditions
  );
  const [optionalOpen, setOptionalOpen] = useState(restored.optionalOpen);

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

  const submittable = isRequiredComplete(conditions);

  return (
    // 짧은 상태에서는 CTA 가 화면 아래에 붙고, 2단계를 펼치면 본문을 따라 내려간다
    <form
      className="flex flex-1 flex-col px-gutter pt-5 pb-[calc(env(safe-area-inset-bottom)+12px)]"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/eligibility/loans");
      }}
    >
      <RequiredConditionFields conditions={conditions} onChange={updateField} />

      {optionalOpen && (
        <div className="mt-5">
          <OptionalConditionFields
            conditions={conditions}
            onChange={updateField}
          />
        </div>
      )}

      <div className="mt-auto flex flex-col items-center gap-5 pt-7">
        <button
          type="button"
          onClick={() => setOptionalOpen((previous) => !previous)}
          aria-expanded={optionalOpen}
          className="flex w-full items-center justify-center gap-[6px] px-[10px] py-[6px] text-body-2 font-medium text-neutral-300"
        >
          더 정확하게 2단계 선택 입력하기
          <ChevronIcon
            aria-hidden="true"
            className={cn(
              "size-6 shrink-0",
              optionalOpen ? "-rotate-90" : "rotate-90"
            )}
          />
        </button>

        <button
          type="submit"
          disabled={!submittable}
          className={cn(
            "flex h-[44px] w-full items-center justify-center rounded-[6px] p-[10px]",
            "text-subtitle-4 font-bold text-white",
            submittable ? "bg-primary" : "bg-primary-400"
          )}
        >
          다음
        </button>
      </div>
    </form>
  );
}
