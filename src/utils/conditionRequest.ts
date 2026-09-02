import type { EligibilityConditions } from "@/types/eligibility";
import type { HouseholdType, UserConditionRequest } from "@/types/financing";

const HOUSEHOLD_TYPE_MAP: Record<string, HouseholdType> = {
  세대주: "HEAD",
  단독세대주: "SINGLE_HEAD",
  세대원: "MEMBER",
};

/** 생년월일 6자리(YYMMDD) → YYYY-MM-DD. 만 19~45세 범위라 YY 로 세기를 가른다 */
function toIsoBirthDate(yymmdd: string): string {
  const yy = Number(yymmdd.slice(0, 2));
  const year = yy <= 25 ? 2000 + yy : 1900 + yy;
  return `${year}-${yymmdd.slice(2, 4)}-${yymmdd.slice(4, 6)}`;
}

function manwon(value: string): number | undefined {
  return value === "" ? undefined : Number(value);
}

/**
 * 조건 입력 폼 상태 → API 요청 body.
 * 필수 5개가 안 채워졌으면 null. (선택 입력은 있는 것만 담는다)
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

  return {
    annual_income: Number(c.annualIncome),
    cash: Number(c.assets),
    birth_date: toIsoBirthDate(c.birthDate),
    marital: c.maritalStatus === "기혼" ? "MARRIED" : "SINGLE",
    homeless: c.homeOwnership === "none",
    include_deposit_as_cash: c.includesJeonseDeposit || undefined,
    monthly_saving: manwon(c.monthlySaving),
    net_asset: manwon(c.netWorth),
    household_type: c.householdRole
      ? HOUSEHOLD_TYPE_MAP[c.householdRole]
      : undefined,
  };
}
