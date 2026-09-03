import type { EligibilityConditions } from "@/types/eligibility";
import type {
  HouseholdType,
  IncomeType,
  Marital,
  UserConditionRequest,
} from "@/types/financing";

const HOUSEHOLD_TYPE_MAP: Record<string, HouseholdType> = {
  세대주: "HEAD",
  단독세대주: "SINGLE_HEAD",
  세대원: "MEMBER",
};

const MARITAL_MAP: Record<string, Marital> = {
  기혼: "MARRIED",
  미혼: "SINGLE",
  결혼예정: "ENGAGED",
};

/** 생년월일 6자리(YYMMDD) → YYYY-MM-DD. 만 19~45세 범위라 YY 로 세기를 가른다 */
function toIsoBirthDate(yymmdd: string): string {
  const yy = Number(yymmdd.slice(0, 2));
  const year = yy <= 25 ? 2000 + yy : 1900 + yy;
  return `${year}-${yymmdd.slice(2, 4)}-${yymmdd.slice(4, 6)}`;
}

/** YYYYMM 6자리 → YYYY-MM. 자리수가 안 맞으면 undefined */
function toYearMonth(value: string): string | undefined {
  return value.length === 6
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}`
    : undefined;
}

/** YYYYMMDD 8자리 → YYYY-MM-DD. 자리수가 안 맞으면 undefined */
function toIsoDate(value: string): string | undefined {
  return value.length === 8
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
    : undefined;
}

function num(value: string | undefined): number | undefined {
  if (value == null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * 조건 입력 폼 상태 → API 요청 body.
 * 필수 5개가 안 채워졌으면 null. (선택 입력은 채워진 것만 담는다)
 */
export function toUserConditionRequest(
  c: EligibilityConditions
): UserConditionRequest | null {
  if (
    c.annualIncome === "" ||
    c.assets === "" ||
    c.birthDate.length !== 6 ||
    c.maritalStatus === null ||
    c.homeOwnership === null
  ) {
    return null;
  }

  const account = c.hasSubscriptionAccount
    ? {
        opened_at: toIsoDate(c.subscriptionAccountOpenedDate),
        deposit_count: num(c.subscriptionAccountDepositCount),
      }
    : undefined;

  // 정책대출 상세 확인을 고르지 않으면 그 요건 값들은 보내지 않는다.
  // 골랐다가 되돌린 경우 남아 있는 값이 판정에 섞이지 않게 하려는 것.
  const policy = c.checkPolicyLoan;

  return {
    annual_income: Number(c.annualIncome),
    cash: Number(c.assets),
    birth_date: toIsoBirthDate(c.birthDate),
    marital: MARITAL_MAP[c.maritalStatus] ?? "SINGLE",
    homeless: c.homeOwnership === "none",
    include_deposit_as_cash: c.includesJeonseDeposit || undefined,
    income_type:
      c.incomeType === "근로"
        ? "SALARY"
        : c.incomeType === "사업"
          ? "BUSINESS"
          : (undefined as IncomeType | undefined),
    monthly_saving: num(c.monthlySaving),
    spouse_income: num(c.spouseIncome),
    // 결혼예정일은 "결혼예정" 일 때만 의미가 있다 (기혼은 이미 혼인 상태)
    marriage_planned_date:
      c.maritalStatus === "결혼예정"
        ? toYearMonth(c.marriagePlannedMonth)
        : undefined,
    existing_loan_monthly_payment: c.hasExistingLoan
      ? num(c.existingLoanMonthlyPayment)
      : undefined,
    existing_loan_balance: c.hasExistingLoan
      ? num(c.existingLoanBalance)
      : undefined,
    household_type:
      policy && c.householdRole
        ? HOUSEHOLD_TYPE_MAP[c.householdRole]
        : undefined,
    all_members_homeless: (policy && c.allMembersHomeless) || undefined,
    net_asset: policy ? num(c.netWorth) : undefined,
    has_subscription_right: c.hasSubscriptionRight || undefined,
    first_time_buyer: (policy && c.firstTimeBuyer) || undefined,
    subscription_account: account,
  };
}
