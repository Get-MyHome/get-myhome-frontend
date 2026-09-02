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

/** 가입기간(개월) → 가입일 YYYY-MM-01. 오늘로부터 N개월 전 달의 1일 */
function monthsAgoToDate(months: string): string | undefined {
  const n = num(months);
  if (n == null) return undefined;
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
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
        opened_at: monthsAgoToDate(c.subscriptionAccountMonths),
        deposit_count: num(c.subscriptionAccountDepositCount),
      }
    : undefined;

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
    marriage_planned_date: toYearMonth(c.marriagePlannedMonth),
    existing_loan_monthly_payment: c.hasExistingLoan
      ? num(c.existingLoanMonthlyPayment)
      : undefined,
    existing_loan_balance: c.hasExistingLoan
      ? num(c.existingLoanBalance)
      : undefined,
    household_type: c.householdRole
      ? HOUSEHOLD_TYPE_MAP[c.householdRole]
      : undefined,
    all_members_homeless: c.allMembersHomeless || undefined,
    net_asset: num(c.netWorth),
    has_subscription_right: c.hasSubscriptionRight || undefined,
    first_time_buyer: c.firstTimeBuyer || undefined,
    subscription_account: account,
  };
}
