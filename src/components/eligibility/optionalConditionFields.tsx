"use client";

import { ChoiceGroup } from "@/components/ui/choiceGroup";
import { SelectField } from "@/components/ui/selectField";
import { TextField } from "@/components/ui/textField";
import {
  HOUSEHOLD_ROLES,
  type EligibilityConditions,
} from "@/types/eligibility";
import { AMOUNT_MAX_LENGTH, amountSuffix, normalizeAmount } from "@/utils/amount";
import { cn } from "@/utils/cn";

const YES_NO = [
  { value: "yes", label: "예" },
  { value: "no", label: "아니오" },
] as const;

function digits(value: string, max: number): string {
  return value.replace(/[^0-9]/g, "").slice(0, max);
}

/**
 * 라벨 없이 단위만 붙는 짧은 입력. 청약통장 가입기간·납입횟수처럼 두 칸이
 * 나란히 놓이는 자리에 쓴다. 테두리·글자 크기 규칙은 TextField 와 맞춘다
 * (16px 미만이면 iOS Safari 가 포커스 시 화면을 확대한다).
 */
function UnitInput({
  value,
  onChange,
  placeholder,
  unit,
  maxLength,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  unit: string;
  maxLength: number;
  label: string;
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-[6px] rounded-[6px] border border-primary-400 p-[10px]",
        "focus-within:border-primary"
      )}
    >
      <input
        aria-label={label}
        value={value}
        onChange={(event) => onChange(digits(event.target.value, maxLength))}
        placeholder={placeholder}
        inputMode="numeric"
        className="min-w-0 flex-1 text-[16px] leading-[20px] font-medium text-foreground outline-none placeholder:text-neutral-300"
      />
      <span className="shrink-0 text-body-2 font-medium text-neutral-300">
        {unit}
      </span>
    </label>
  );
}

/**
 * 2단계 정밀 입력 (Figma 14:1449).
 * 이 화면의 항목은 전부 선택 입력이라 필수 표시(별표)를 붙이지 않는다.
 * 예/아니오 응답에 딸린 입력칸은 "예" 일 때만 보여준다 — 판정에 전달할 때도
 * 같은 기준으로 걸러지므로, 보이는데 무시되는 칸이 없도록 맞춘 것이다.
 */
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
  const yesNo = (key: keyof EligibilityConditions, label: string) => (
    <ChoiceGroup
      label={label}
      value={conditions[key] ? "yes" : "no"}
      options={YES_NO}
      onChange={(value) => onChange(key, (value === "yes") as never)}
    />
  );

  return (
    <div className="flex flex-col gap-5">
      <p className="text-body-2 font-medium text-foreground">
        상세 내용을 채우면 바로 볼 수 있어요.
      </p>

      {yesNo("hasExistingLoan", "기존 대출이 있으신가요?")}

      {conditions.hasExistingLoan && (
        <TextField
          label="월 원리금 상환액"
          value={conditions.existingLoanMonthlyPayment}
          onChange={(value) =>
            onChange("existingLoanMonthlyPayment", normalizeAmount(value))
          }
          placeholder="숫자입력"
          suffix={amountSuffix(conditions.existingLoanMonthlyPayment)}
          inputMode="numeric"
          maxLength={AMOUNT_MAX_LENGTH}
        />
      )}

      {yesNo(
        "checkPolicyLoan",
        "정책대출(디딤돌·청년주택드림 등) 조건도 확인하시겠어요?",
      )}

      <SelectField
        label="세대구성"
        value={conditions.householdRole}
        options={HOUSEHOLD_ROLES}
        onChange={(value) => onChange("householdRole", value)}
      />

      {yesNo("allMembersHomeless", "세대원 전원 무주택인가요?")}

      <TextField
        label="순자산 (본인·배우자 합산)"
        value={conditions.netWorth}
        onChange={(value) => onChange("netWorth", normalizeAmount(value))}
        placeholder="숫자입력"
        suffix={amountSuffix(conditions.netWorth)}
        inputMode="numeric"
        maxLength={AMOUNT_MAX_LENGTH}
      />

      {yesNo("firstTimeBuyer", "생애최초 여부")}

      <div className="flex flex-col gap-[10px]">
        {yesNo("hasSubscriptionAccount", "청약통장이 있으신가요?")}

        {conditions.hasSubscriptionAccount && (
          <div className="grid grid-cols-2 gap-[11px]">
            <UnitInput
              label="청약통장 가입기간"
              value={conditions.subscriptionAccountMonths}
              onChange={(value) => onChange("subscriptionAccountMonths", value)}
              placeholder="가입기간"
              unit="개월"
              maxLength={3}
            />
            <UnitInput
              label="청약통장 납입횟수"
              value={conditions.subscriptionAccountDepositCount}
              onChange={(value) =>
                onChange("subscriptionAccountDepositCount", value)
              }
              placeholder="납입횟수"
              unit="회"
              maxLength={4}
            />
          </div>
        )}
      </div>

      <TextField
        label="월 저축 가능액"
        value={conditions.monthlySaving}
        onChange={(value) => onChange("monthlySaving", normalizeAmount(value))}
        placeholder="숫자입력"
        suffix={amountSuffix(conditions.monthlySaving)}
        inputMode="numeric"
        maxLength={AMOUNT_MAX_LENGTH}
      />
    </div>
  );
}
