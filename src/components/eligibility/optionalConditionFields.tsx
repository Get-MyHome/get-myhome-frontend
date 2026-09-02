"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { SelectField } from "@/components/ui/selectField";
import { TextField } from "@/components/ui/textField";
import {
  HOUSEHOLD_ROLES,
  INCOME_TYPES,
  SUBSCRIPTION_ACCOUNT_TYPES,
  type EligibilityConditions,
} from "@/types/eligibility";
import { AMOUNT_MAX_LENGTH, amountSuffix, normalizeAmount } from "@/utils/amount";

/** YYYYMM 6자리만 남긴다 */
function yearMonthDigits(value: string): string {
  return value.replace(/[^0-9]/g, "").slice(0, 6);
}

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
      <SelectField
        label="소득 형태"
        value={conditions.incomeType}
        options={INCOME_TYPES}
        onChange={(value) => onChange("incomeType", value)}
      />

      <TextField
        label="월 저축 가능액"
        value={conditions.monthlySaving}
        onChange={(value) => onChange("monthlySaving", normalizeAmount(value))}
        placeholder="숫자입력"
        suffix={amountSuffix(conditions.monthlySaving)}
        inputMode="numeric"
        maxLength={AMOUNT_MAX_LENGTH}
      />

      <TextField
        label="배우자·예비배우자 연소득"
        value={conditions.spouseIncome}
        onChange={(value) => onChange("spouseIncome", normalizeAmount(value))}
        placeholder="숫자입력"
        suffix={amountSuffix(conditions.spouseIncome)}
        inputMode="numeric"
        maxLength={AMOUNT_MAX_LENGTH}
      />

      <TextField
        label="결혼 예정일 (YYYYMM)"
        value={conditions.marriagePlannedMonth}
        onChange={(value) =>
          onChange("marriagePlannedMonth", yearMonthDigits(value))
        }
        placeholder="예: 202705"
        inputMode="numeric"
        maxLength={6}
      />

      <TextField
        label="기존 대출 월 상환액"
        value={conditions.existingLoanMonthlyPayment}
        onChange={(value) =>
          onChange("existingLoanMonthlyPayment", normalizeAmount(value))
        }
        placeholder="숫자입력"
        suffix={amountSuffix(conditions.existingLoanMonthlyPayment)}
        inputMode="numeric"
        maxLength={AMOUNT_MAX_LENGTH}
      />

      <TextField
        label="기존 대출 잔액"
        value={conditions.existingLoanBalance}
        onChange={(value) =>
          onChange("existingLoanBalance", normalizeAmount(value))
        }
        placeholder="숫자입력"
        suffix={amountSuffix(conditions.existingLoanBalance)}
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
        suffix={amountSuffix(conditions.netWorth)}
        inputMode="numeric"
        maxLength={AMOUNT_MAX_LENGTH}
      />

      <SelectField
        label="청약통장 종류"
        value={conditions.subscriptionAccountType}
        options={SUBSCRIPTION_ACCOUNT_TYPES}
        onChange={(value) => onChange("subscriptionAccountType", value)}
      />

      <TextField
        label="청약통장 가입 연월 (YYYYMM)"
        value={conditions.subscriptionAccountOpenedMonth}
        onChange={(value) =>
          onChange("subscriptionAccountOpenedMonth", yearMonthDigits(value))
        }
        placeholder="예: 202301"
        inputMode="numeric"
        maxLength={6}
      />

      <TextField
        label="청약통장 납입 횟수"
        value={conditions.subscriptionAccountDepositCount}
        onChange={(value) =>
          onChange(
            "subscriptionAccountDepositCount",
            value.replace(/[^0-9]/g, "").slice(0, 4),
          )
        }
        placeholder="숫자입력"
        suffix="회"
        inputMode="numeric"
        maxLength={4}
      />

      <div className="flex flex-col gap-[12px]">
        <Checkbox
          checked={conditions.allMembersHomeless}
          onChange={(checked) => onChange("allMembersHomeless", checked)}
        >
          세대원 전원 무주택
        </Checkbox>
        <Checkbox
          checked={conditions.firstTimeBuyer}
          onChange={(checked) => onChange("firstTimeBuyer", checked)}
        >
          생애최초 주택 구입
        </Checkbox>
        <Checkbox
          checked={conditions.hasSubscriptionRight}
          onChange={(checked) => onChange("hasSubscriptionRight", checked)}
        >
          분양권·입주권 보유
        </Checkbox>
      </div>
    </div>
  );
}
