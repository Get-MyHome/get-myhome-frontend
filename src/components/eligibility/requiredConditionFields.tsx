"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceGroup } from "@/components/ui/choiceGroup";
import { SelectField } from "@/components/ui/selectField";
import { TextField } from "@/components/ui/textField";
import {
  MARITAL_STATUSES,
  type EligibilityConditions,
  type HomeOwnership,
} from "@/types/eligibility";
import { AMOUNT_MAX_LENGTH, amountSuffix, normalizeAmount } from "@/utils/amount";

const HOME_OWNERSHIP_OPTIONS = [
  { value: "none", label: "무주택" },
  { value: "owned", label: "유주택" },
] as const satisfies readonly { value: HomeOwnership; label: string }[];

/** 생년월일은 앞자리 0 을 살려야 하므로 숫자만 걸러낸다 */
function digitsOnly(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

export function RequiredConditionFields({
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
    <div className="flex flex-col gap-[12px]">
      <div className="flex flex-col gap-5">
        <TextField
          label="연소득 (만원)"
          required
          value={conditions.annualIncome}
          onChange={(value) => onChange("annualIncome", normalizeAmount(value))}
          placeholder="숫자입력"
          suffix={amountSuffix(conditions.annualIncome)}
          inputMode="numeric"
          maxLength={AMOUNT_MAX_LENGTH}
        />

        <TextField
          label="보유자산 (만원)"
          required
          value={conditions.assets}
          onChange={(value) => onChange("assets", normalizeAmount(value))}
          placeholder="숫자입력"
          suffix={amountSuffix(conditions.assets)}
          inputMode="numeric"
          maxLength={AMOUNT_MAX_LENGTH}
        />

        <TextField
          label="생년월일"
          required
          value={conditions.birthDate}
          onChange={(value) => onChange("birthDate", digitsOnly(value))}
          placeholder="생년월일 6자리를 입력해주세요."
          inputMode="numeric"
          maxLength={6}
        />

        <SelectField
          label="혼인·자녀"
          required
          value={conditions.maritalStatus}
          options={MARITAL_STATUSES}
          onChange={(value) => onChange("maritalStatus", value)}
        />

        <ChoiceGroup
          label="현재 보유하고 있는 주택이 있나요?"
          required
          value={conditions.homeOwnership}
          options={HOME_OWNERSHIP_OPTIONS}
          onChange={(value) => onChange("homeOwnership", value)}
        />
      </div>

      <Checkbox
        checked={conditions.includesJeonseDeposit}
        onChange={(checked) => onChange("includesJeonseDeposit", checked)}
      >
        전세 보증금 포함여부 (선택)
      </Checkbox>
    </div>
  );
}
