"use client";

import { ChoiceGroup } from "@/components/ui/choiceGroup";
import { SelectField } from "@/components/ui/selectField";
import { TextField } from "@/components/ui/textField";
import {
  HOUSEHOLD_ROLES,
  type EligibilityConditions,
} from "@/types/eligibility";
import { AMOUNT_MAX_LENGTH, amountSuffix, normalizeAmount } from "@/utils/amount";

const YES_NO = [
  { value: "yes", label: "예" },
  { value: "no", label: "아니오" },
] as const;

function digits(value: string, max: number): string {
  return value.replace(/[^0-9]/g, "").slice(0, max);
}

/** 2단계 정밀 입력 (Figma 14:1449). 예/아니오 + 금액 위주 */
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
      required
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

      <TextField
        label="월 원리금 상환액"
        required
        value={conditions.existingLoanMonthlyPayment}
        onChange={(value) =>
          onChange("existingLoanMonthlyPayment", normalizeAmount(value))
        }
        placeholder="숫자입력"
        suffix={amountSuffix(conditions.existingLoanMonthlyPayment)}
        inputMode="numeric"
        maxLength={AMOUNT_MAX_LENGTH}
      />

      {yesNo(
        "checkPolicyLoan",
        "정책대출(디딤돌·청년주택드림 등) 조건도 확인하시겠어요?",
      )}

      <SelectField
        label="세대구성"
        required
        value={conditions.householdRole}
        options={HOUSEHOLD_ROLES}
        onChange={(value) => onChange("householdRole", value)}
      />

      {yesNo("allMembersHomeless", "세대원 전원 무주택인가요?")}

      <TextField
        label="순자산 (본인·배우자 합산)"
        required
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

        <div className="grid grid-cols-2 gap-[11px]">
          <label className="flex items-center rounded-[6px] border border-primary-400 p-[10px] text-body-2 font-medium text-neutral-300 focus-within:border-primary">
            <input
              inputMode="numeric"
              value={conditions.subscriptionAccountMonths}
              onChange={(event) =>
                onChange(
                  "subscriptionAccountMonths",
                  digits(event.target.value, 3),
                )
              }
              placeholder="가입기간"
              className="min-w-0 flex-1 bg-transparent text-foreground placeholder:text-neutral-300 focus:outline-none"
            />
            개월
          </label>
          <label className="flex items-center rounded-[6px] border border-primary-400 p-[10px] text-body-2 font-medium text-neutral-300 focus-within:border-primary">
            <input
              inputMode="numeric"
              value={conditions.subscriptionAccountDepositCount}
              onChange={(event) =>
                onChange(
                  "subscriptionAccountDepositCount",
                  digits(event.target.value, 4),
                )
              }
              placeholder="납입횟수"
              className="min-w-0 flex-1 bg-transparent text-foreground placeholder:text-neutral-300 focus:outline-none"
            />
            회
          </label>
        </div>
      </div>

      <TextField
        label="월 저축 가능액"
        required
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
