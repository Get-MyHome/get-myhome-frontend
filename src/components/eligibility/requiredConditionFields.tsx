"use client";

import { useState } from "react";

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

const BIRTH_DATE_LENGTH = 6;

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
  // 입력 도중에 에러를 띄우지 않도록, 한 번 벗어난 뒤부터 검사한다
  const [birthDateTouched, setBirthDateTouched] = useState(false);
  const birthDateIncomplete =
    conditions.birthDate.length > 0 &&
    conditions.birthDate.length < BIRTH_DATE_LENGTH;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-body-2 font-medium text-foreground">
        기본 6개 항목만 채우면 바로 볼 수 있어요.
      </p>

      <TextField
        label="생년월일"
        required
        value={conditions.birthDate}
        onChange={(value) => onChange("birthDate", digitsOnly(value))}
        onBlur={() => setBirthDateTouched(true)}
        placeholder="예) 930101"
        inputMode="numeric"
        maxLength={BIRTH_DATE_LENGTH}
        error={
          birthDateTouched && birthDateIncomplete
            ? "생년월일 6자리를 모두 입력해주세요."
            : undefined
        }
      />

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
        label="현재 사용 가능한 보유 현금"
        required
        value={conditions.assets}
        onChange={(value) => onChange("assets", normalizeAmount(value))}
        placeholder="숫자입력"
        suffix={amountSuffix(conditions.assets)}
        inputMode="numeric"
        maxLength={AMOUNT_MAX_LENGTH}
      />

      <SelectField
        label="혼인 여부"
        required
        value={conditions.maritalStatus}
        options={MARITAL_STATUSES}
        onChange={(value) => {
          onChange("maritalStatus", value);
          // 미혼으로 바꾸면 배우자 연소득 입력값을 비운다
          if (value === "미혼") onChange("spouseIncome", "");
        }}
      />

      {(conditions.maritalStatus === "기혼" ||
        conditions.maritalStatus === "결혼예정") && (
        <TextField
          label="배우자·예비배우자 연소득"
          required
          value={conditions.spouseIncome}
          onChange={(value) => onChange("spouseIncome", normalizeAmount(value))}
          placeholder="숫자입력"
          suffix={amountSuffix(conditions.spouseIncome)}
          inputMode="numeric"
          maxLength={AMOUNT_MAX_LENGTH}
        />
      )}

      <ChoiceGroup
        label="현재 보유하고 있는 주택이 있나요?"
        required
        value={conditions.homeOwnership}
        options={HOME_OWNERSHIP_OPTIONS}
        onChange={(value) => onChange("homeOwnership", value)}
      />

      <Checkbox
        checked={conditions.includesJeonseDeposit}
        onChange={(checked) => onChange("includesJeonseDeposit", checked)}
      >
        전세 보증금 포함여부 (선택)
      </Checkbox>
    </div>
  );
}
