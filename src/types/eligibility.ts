/** 혼인 상태. "결혼예정" → API ENGAGED */
export const MARITAL_STATUSES = ["기혼", "미혼", "결혼예정"] as const;
export type MaritalStatus = (typeof MARITAL_STATUSES)[number];

/** 세대 구성 */
export const HOUSEHOLD_ROLES = ["세대주", "단독세대주", "세대원"] as const;
export type HouseholdRole = (typeof HOUSEHOLD_ROLES)[number];

/** 소득 형태 */
export const INCOME_TYPES = ["근로", "사업"] as const;
export type IncomeTypeLabel = (typeof INCOME_TYPES)[number];

/** 청약통장 종류 */
export const SUBSCRIPTION_ACCOUNT_TYPES = [
  "주택청약종합저축",
  "청약저축",
  "청년주택드림",
  "없음",
] as const;
export type SubscriptionAccountType =
  (typeof SUBSCRIPTION_ACCOUNT_TYPES)[number];

/** 주택 보유 여부 */
export type HomeOwnership = "none" | "owned";

/** 가능성 판정에 쓰는 조건. 금액 단위는 만원, 텍스트 입력은 문자열로 둔다 */
export interface EligibilityConditions {
  // 1단계 — 필수
  /** 연소득 (만원) */
  annualIncome: string;
  /** 보유자산 (만원) */
  assets: string;
  /** 생년월일 6자리 */
  birthDate: string;
  maritalStatus: MaritalStatus | null;
  homeOwnership: HomeOwnership | null;
  /** 전세 보증금 포함 여부 (선택) */
  includesJeonseDeposit: boolean;

  // 2단계 — 전부 선택
  incomeType: IncomeTypeLabel | null;
  monthlySaving: string;
  /** 배우자·예비배우자 연소득 (만원) */
  spouseIncome: string;
  /** 결혼 예정일 6자리 (YYYYMM) */
  marriagePlannedMonth: string;
  /** 기존 대출 월 상환액 (만원) */
  existingLoanMonthlyPayment: string;
  /** 기존 대출 잔액 (만원) */
  existingLoanBalance: string;
  /** 기존 대출 보유 여부 */
  hasExistingLoan: boolean;
  /** 정책대출(디딤돌·청년주택드림) 조건도 확인할지 */
  checkPolicyLoan: boolean;
  householdRole: HouseholdRole | null;
  allMembersHomeless: boolean;
  /** 순자산 본인·배우자 합산 (만원) */
  netWorth: string;
  /** 분양권·입주권 보유 여부 */
  hasSubscriptionRight: boolean;
  firstTimeBuyer: boolean;
  /** 청약통장 보유 여부 */
  hasSubscriptionAccount: boolean;
  subscriptionAccountType: SubscriptionAccountType | null;
  /** 청약통장 가입기간 (개월) */
  subscriptionAccountMonths: string;
  /** 청약통장 가입 연월 6자리 (YYYYMM) */
  subscriptionAccountOpenedMonth: string;
  /** 청약통장 납입 횟수 */
  subscriptionAccountDepositCount: string;
}

export const EMPTY_CONDITIONS: EligibilityConditions = {
  annualIncome: "",
  assets: "",
  birthDate: "",
  maritalStatus: null,
  homeOwnership: null,
  includesJeonseDeposit: false,
  incomeType: null,
  monthlySaving: "",
  spouseIncome: "",
  marriagePlannedMonth: "",
  existingLoanMonthlyPayment: "",
  existingLoanBalance: "",
  hasExistingLoan: false,
  checkPolicyLoan: false,
  householdRole: null,
  allMembersHomeless: false,
  netWorth: "",
  hasSubscriptionRight: false,
  firstTimeBuyer: false,
  hasSubscriptionAccount: false,
  subscriptionAccountType: null,
  subscriptionAccountMonths: "",
  subscriptionAccountOpenedMonth: "",
  subscriptionAccountDepositCount: "",
};

/** 배우자 소득까지 받아야 하는 혼인 상태 (신혼 상품은 부부합산으로 판정한다) */
export function needsSpouseIncome(
  maritalStatus: MaritalStatus | null,
): boolean {
  return maritalStatus === "기혼" || maritalStatus === "결혼예정";
}

/** 1단계 필수 항목이 모두 채워졌는지 */
export function isRequiredComplete(conditions: EligibilityConditions): boolean {
  return (
    conditions.annualIncome !== "" &&
    conditions.assets !== "" &&
    conditions.birthDate.length === 6 &&
    conditions.maritalStatus !== null &&
    conditions.homeOwnership !== null &&
    // 기혼·결혼예정이면 배우자 연소득도 필수다 (화면에서도 필수 표시된다)
    (!needsSpouseIncome(conditions.maritalStatus) ||
      conditions.spouseIncome !== "")
  );
}
