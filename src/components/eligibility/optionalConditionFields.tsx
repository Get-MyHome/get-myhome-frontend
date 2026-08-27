"use client";

import { SelectField } from "@/components/ui/selectField";
import { TextField } from "@/components/ui/textField";
import {
  HOUSEHOLD_ROLES,
  type EligibilityConditions,
} from "@/types/eligibility";
import { AMOUNT_MAX_LENGTH, normalizeAmount } from "@/utils/amount";

/** 2단계 선택 입력. 판정 정확도를 높이는 항목들로 전부 필수가 아니다 */
export function OptionalConditionFields({
  conditions,
  onChange,
}: {
  conditions: EligibilityConditions;
  onChange: <Key extends keyof EligibilityConditions>(
    key: Key,
    value: EligibilityConditions[Key],
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <TextField
        label="월 저축 가능액"
        value={conditions.monthlySaving}
        onChange={(value) => onChange("monthlySaving", normalizeAmount(value))}
        placeholder="숫자입력"
        suffix="만원"
        inputMode="numeric"
        maxLength={AMOUNT_MAX_LENGTH}
      />

      <SelectField
        label="세대 구성"
        value={conditions.householdRole}
        options={HOUSEHOLD_ROLES}
        onChange={(value) => onChange("householdRole", value)}
      />

      <TextField
        label="순자산 (본인·배우자 합산)"
        value={conditions.netWorth}
        onChange={(value) => onChange("netWorth", normalizeAmount(value))}
        placeholder="숫자입력"
        suffix="만원"
        inputMode="numeric"
        maxLength={AMOUNT_MAX_LENGTH}
      />
    </div>
  );
}
