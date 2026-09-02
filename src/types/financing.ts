/**
 * 대출 자격 조회 / 공고 매칭 API. 스펙 문서는 camelCase 지만 실제 요청·응답은
 * snake_case 다 — 실측값 기준.
 */

export type Marital = "SINGLE" | "MARRIED" | "ENGAGED";
export type IncomeType = "SALARY" | "BUSINESS";
export type HouseholdType = "HEAD" | "SINGLE_HEAD" | "MEMBER";

/** POST /financing-routes, POST /complexes/matched 요청의 사용자 조건. 금액 단위: 만 원 */
export interface UserConditionRequest {
  annual_income: number;
  cash: number;
  /** YYYY-MM-DD */
  birth_date: string;
  marital: Marital;
  homeless: boolean;
  include_deposit_as_cash?: boolean;
  income_type?: IncomeType;
  monthly_saving?: number;
  spouse_income?: number;
  /** YYYY-MM */
  marriage_planned_date?: string;
  existing_loan_monthly_payment?: number;
  existing_loan_balance?: number;
  household_type?: HouseholdType;
  all_members_homeless?: boolean;
  net_asset?: number;
  has_subscription_right?: boolean;
  first_time_buyer?: boolean;
  subscription_account?: {
    type?: string;
    /** YYYY-MM-DD */
    opened_at?: string;
    deposit_count?: number;
    deposit_amount?: number;
  };
}

/** 6개 대출 상품 코드 */
export type FinancingProductCode =
  | "DIDIMDOL_GENERAL"
  | "DIDIMDOL_FIRST"
  | "DIDIMDOL_NEWLYWED"
  | "YOUTH_DREAM_SINGLE"
  | "YOUTH_DREAM_NEWLYWED"
  | "BANK_MORTGAGE";

/** 판정 상태 4종. GAP·BLOCK 은 금액 계산 구간, 자격에는 OK·HOLD 만 */
export type VerdictStatus = "OK" | "GAP" | "BLOCK" | "HOLD";

/** POST /financing-routes 응답의 routes 항목 */
export interface FinancingRouteDetail {
  product_code: FinancingProductCode;
  product_name: string;
  status: VerdictStatus;
  eligible: boolean;
  /** 한도 하한 (만원). 은행 주담대에서만 */
  limit_min: number | null;
  /** 한도 상한 (만원) */
  limit_max: number | null;
  /** DTI / LTV / DSR / null */
  binding_factor: string | null;
  /** status BLOCK 일 때 미달 사유 */
  ineligible_reason: string | null;
  /** status HOLD 일 때 */
  hold_reason_code: string | null;
  hold_message: string | null;
}

export interface FinancingRouteResult {
  /** 30분 유효. 공고 매칭 조회에 재사용 */
  condition_token: string;
  routes: FinancingRouteDetail[];
}
