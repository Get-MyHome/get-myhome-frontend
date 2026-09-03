"use client";

import { ChoiceGroup } from "@/components/ui/choiceGroup";
import { SelectField } from "@/components/ui/selectField";
import { TextField } from "@/components/ui/textField";
import {
  EMPTY_CONDITIONS,
  HOUSEHOLD_ROLES,
  INCOME_TYPES,
  needsMarriagePlannedDate,
  type EligibilityConditions,
} from "@/types/eligibility";
import { AMOUNT_MAX_LENGTH, amountSuffix, normalizeAmount } from "@/utils/amount";

const YES_NO = [
  { value: "yes", label: "예" },
  { value: "no", label: "아니오" },
] as const;

/** 연월(6) · 연월일(8) 자리수. 앞자리 0 을 살려야 해서 숫자만 걸러 받는다 */
const YEAR_MONTH_LENGTH = 6;
const DATE_LENGTH = 8;
const DEPOSIT_COUNT_LENGTH = 4;

function digits(value: string, max: number): string {
  return value.replace(/[^0-9]/g, "").slice(0, max);
}

/**
 * 예/아니오를 "아니오"로 되돌릴 때 함께 비우는 딸린 항목.
 * 화면에서 사라진 칸의 값이 세션에 남아 있으면, 다시 "예"로 바꿨을 때 예전
 * 입력이 되살아나 사용자가 확인하지 않은 값으로 판정이 돌아간다.
 */
const DEPENDENT_FIELDS: Partial<
  Record<keyof EligibilityConditions, (keyof EligibilityConditions)[]>
> = {
  hasExistingLoan: ["existingLoanMonthlyPayment", "existingLoanBalance"],
  checkPolicyLoan: [
    "householdRole",
    "allMembersHomeless",
    "netWorth",
    "firstTimeBuyer",
  ],
  hasSubscriptionAccount: [
    "subscriptionAccountOpenedDate",
    "subscriptionAccountDepositCount",
  ],
};

/**
 * 2단계 정밀 입력 (Figma 14:1449 + 기획서 기능 6).
 *
 * 이 화면의 항목은 전부 선택 입력이라 필수 표시(별표)를 붙이지 않는다.
 * 딸린 입력칸은 앞선 응답이 "예" 일 때만 보여준다 — 판정에 전달할 때도 같은
 * 기준으로 걸러지므로, 보이는데 무시되는 칸이 없도록 맞춘 것이다.
 *
 * 노출 조건
 * - 기존 대출 있음      → 월 원리금 상환액, 기존 대출 잔액
 * - 정책대출 상세 확인   → 세대구성, 세대원 전원 무주택, 순자산, 생애최초
 * - 청약통장 있음        → 개설일, 납입횟수
 * - 혼인 여부 = 결혼예정 → 결혼 예정일 (1단계 응답에 딸린 항목)
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
      // null 이면 아무것도 선택되지 않은 상태로 둔다
      value={conditions[key] === null ? null : conditions[key] ? "yes" : "no"}
      options={YES_NO}
      onChange={(value) => {
        const on = value === "yes";
        onChange(key, on as never);
        if (on) return;
        // 초기값으로 되돌린다. 타입별 빈 값은 EMPTY_CONDITIONS 가 갖고 있다
        for (const field of DEPENDENT_FIELDS[key] ?? []) {
          onChange(field, EMPTY_CONDITIONS[field] as never);
        }
      }}
    />
  );

  const amountField = (
    key: "existingLoanMonthlyPayment" | "existingLoanBalance" | "netWorth" | "monthlySaving",
    label: string,
  ) => (
    <TextField
      label={label}
      value={conditions[key]}
      onChange={(value) => onChange(key, normalizeAmount(value))}
      placeholder="숫자입력"
      suffix={amountSuffix(conditions[key])}
      inputMode="numeric"
      maxLength={AMOUNT_MAX_LENGTH}
    />
  );

  return (
    <div className="flex flex-col gap-5">
      <p className="text-body-2 font-medium text-foreground">
        상세 내용을 채우면 바로 볼 수 있어요.
      </p>

      <SelectField
        label="소득 형태"
        value={conditions.incomeType}
        options={INCOME_TYPES}
        onChange={(value) => onChange("incomeType", value)}
      />

      {needsMarriagePlannedDate(conditions.maritalStatus) && (
        <TextField
          label="결혼 예정일"
          value={conditions.marriagePlannedMonth}
          onChange={(value) =>
            onChange("marriagePlannedMonth", digits(value, YEAR_MONTH_LENGTH))
          }
          placeholder="예) 202705"
          inputMode="numeric"
          maxLength={YEAR_MONTH_LENGTH}
        />
      )}

      {yesNo("hasExistingLoan", "기존 대출이 있으신가요?")}

      {conditions.hasExistingLoan && (
        <>
          {amountField("existingLoanMonthlyPayment", "월 원리금 상환액")}
          {amountField("existingLoanBalance", "기존 대출 잔액")}
        </>
      )}

      {yesNo("hasSubscriptionRight", "청약 당첨권을 보유하고 있나요?")}

      {yesNo(
        "checkPolicyLoan",
        "정책대출(디딤돌·청년주택드림 등) 조건도 확인하시겠어요?",
      )}

      {conditions.checkPolicyLoan && (
        <>
          <SelectField
            label="세대구성"
            value={conditions.householdRole}
            options={HOUSEHOLD_ROLES}
            onChange={(value) => onChange("householdRole", value)}
          />
          {yesNo("allMembersHomeless", "세대원 전원 무주택인가요?")}
          {amountField("netWorth", "순자산 (본인·배우자 합산)")}
          {yesNo("firstTimeBuyer", "생애최초 여부")}
        </>
      )}

      <div className="flex flex-col gap-[10px]">
        {yesNo("hasSubscriptionAccount", "청약통장이 있으신가요?")}

        {conditions.hasSubscriptionAccount && (
          <>
            <TextField
              label="청약통장 개설일"
              value={conditions.subscriptionAccountOpenedDate}
              onChange={(value) =>
                onChange(
                  "subscriptionAccountOpenedDate",
                  digits(value, DATE_LENGTH),
                )
              }
              placeholder="예) 20230110"
              inputMode="numeric"
              maxLength={DATE_LENGTH}
            />
            <TextField
              label="납입횟수"
              value={conditions.subscriptionAccountDepositCount}
              onChange={(value) =>
                onChange(
                  "subscriptionAccountDepositCount",
                  digits(value, DEPOSIT_COUNT_LENGTH),
                )
              }
              placeholder="숫자입력"
              suffix="회"
              inputMode="numeric"
              maxLength={DEPOSIT_COUNT_LENGTH}
            />
          </>
        )}
      </div>

      {amountField("monthlySaving", "월 저축 가능액")}
    </div>
  );
}
