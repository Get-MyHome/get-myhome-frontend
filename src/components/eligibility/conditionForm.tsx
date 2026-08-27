"use client";

import { useCallback, useState } from "react";

import ChevronIcon from "@/assets/icons/chevronRight.svg";
import {
  EMPTY_CONDITIONS,
  isRequiredComplete,
  type EligibilityConditions,
} from "@/types/eligibility";
import { cn } from "@/utils/cn";

import { OptionalConditionFields } from "./optionalConditionFields";
import { RequiredConditionFields } from "./requiredConditionFields";

export function ConditionForm() {
  const [conditions, setConditions] =
    useState<EligibilityConditions>(EMPTY_CONDITIONS);
  const [optionalOpen, setOptionalOpen] = useState(false);

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
      onSubmit={(event) => event.preventDefault()}
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

        {/* TODO: 결과 화면(/eligibility/result)이 생기면 라우팅을 붙인다 */}
        <button
          type="submit"
          disabled={!submittable}
          className={cn(
            "flex h-[44px] w-full items-center justify-center rounded-[6px] p-[10px]",
            "text-subtitle-4 font-bold text-white",
            submittable ? "bg-primary" : "bg-primary-300"
          )}
        >
          다음
        </button>
      </div>
    </form>
  );
}
