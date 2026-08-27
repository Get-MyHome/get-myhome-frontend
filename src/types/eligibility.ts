/** 혼인 상태 */
export const MARITAL_STATUSES = ["기혼", "미혼"] as const;
export type MaritalStatus = (typeof MARITAL_STATUSES)[number];

/** 세대 구성 */
export const HOUSEHOLD_ROLES = ["세대주", "단독세대주", "세대원"] as const;
export type HouseholdRole = (typeof HOUSEHOLD_ROLES)[number];

/** 주택 보유 여부 */
export type HomeOwnership = "none" | "owned";

/** 가능성 판정에 쓰는 조건. 금액 단위는 만원, 텍스트 입력은 문자열로 둔다 */
export interface EligibilityConditions {
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
  /** 이하 2단계 선택 입력 */
  monthlySaving: string;
  householdRole: HouseholdRole | null;
  netWorth: string;
}

export const EMPTY_CONDITIONS: EligibilityConditions = {
  annualIncome: "",
  assets: "",
  birthDate: "",
  maritalStatus: null,
  homeOwnership: null,
  includesJeonseDeposit: false,
  monthlySaving: "",
  householdRole: null,
  netWorth: "",
};

/** 1단계 필수 항목이 모두 채워졌는지 */
export function isRequiredComplete(conditions: EligibilityConditions): boolean {
  return (
    conditions.annualIncome !== "" &&
    conditions.assets !== "" &&
    conditions.birthDate.length === 6 &&
    conditions.maritalStatus !== null &&
    conditions.homeOwnership !== null
  );
}
