/**
 * POST /verdicts 응답. 스펙 문서는 camelCase 지만 실제 응답은 snake_case 다
 * (다른 API 와 동일). 화면에서 쓰는 필드만 옮겼다.
 */
import type {
  FinancingProductCode,
  UserConditionRequest,
  VerdictStatus,
} from "./financing";

/** 대금 납부 구간 */
export type VerdictStage = "CONTRACT" | "INTERIM" | "BALANCE";

export const STAGE_LABEL: Record<VerdictStage, string> = {
  CONTRACT: "계약금",
  INTERIM: "중도금",
  BALANCE: "잔금",
};

export interface VerdictMeta {
  rule_version: string | null;
  /** 판정 수행 일시 (YYYY-MM-DD) */
  calculated_at: string | null;
  /** step1: 필수만 입력 / step2: 상세까지 입력 */
  precision: string | null;
  /** AI 공고문 분석 검수 상태 */
  analysis_review_status: string | null;
  complex_name: string | null;
  complex_id: string | null;
  unit_type_name: string | null;
  /** 만원 */
  sale_price_manwon: number | null;
  cash_manwon: number | null;
  monthly_saving_manwon: number | null;
  source_page_count: number | null;
}

/** 구간별 판정. 단지를 골랐을 때만 내려온다 */
export interface StageVerdict {
  stage: VerdictStage;
  status: VerdictStatus;
  /** 만원 */
  required: number | null;
  available: number | null;
  gap: number | null;
  months_available: number | null;
  months_needed: number | null;
  scenarios: string[] | null;
  /** 상태 이유 한 줄 요약 (화면 표시용) */
  reason_summary: string | null;
  due_date: string | null;
}

export interface VerdictFinancingRoute {
  product_code: FinancingProductCode;
  product_name: string;
  status: VerdictStatus;
  limit_min: number | null;
  limit_max: number | null;
  /** DTI / LTV / DSR */
  binding_factor: string | null;
}

export interface ShortfallPreparation {
  /** 만원. 계산 불가면 null */
  total_shortfall: number | null;
  shortfall_stage: VerdictStage | null;
  months_remaining: number | null;
  monthly_required: number | null;
  calculable: boolean;
  hold_reason: string | null;
}

export interface VerdictHold {
  reason_code: string | null;
  message: string | null;
  next_action: string | null;
  /** DOCUMENT_UNCERTAINTY: 공고문에서 확인 불가 / PERSONAL_*: 추가 입력 필요 */
  kind: string | null;
  /** true 면 해당 구간 계산을 보류한 것 */
  blocking: boolean;
  related_stage: VerdictStage | null;
}

export interface RiskClause {
  code: string | null;
  impact_stage: VerdictStage | null;
  message: string | null;
  next_action: string | null;
}

/** 중도금 임계선. 통과에 필요한 대출비율과 공고상 알선 범위의 차이 */
export interface InterimCriticalLine {
  /** 통과에 필요한 최소 대출비율 (분양가 대비 0~1) */
  critical_loan_ratio: number | null;
  critical_loan_amount: number | null;
  /** 공고문상 사업주체 알선 비율 (0~1). 미공시면 null */
  arranged_ratio: number | null;
  arranged_amount: number | null;
  /** CONFIRMED / PLANNED / NOT_AVAILABLE / NOT_DISCLOSED */
  arrangement_status: string | null;
  /** 안전마진 (%p). 음수면 알선 범위가 필요 비율에 못 미친다 */
  safety_margin_pp: number | null;
  /** SAFE / WARNING / UNKNOWN */
  safety_status: string | null;
  disclaimer: string | null;
}

export interface VerdictResult {
  verdict_id: string;
  meta: VerdictMeta | null;
  overall_fund_status: VerdictStatus | null;
  /** CONFIRMED / HOLD / PARTIAL 등 */
  overall_info_confidence: string | null;
  first_shortfall_stage: VerdictStage | null;
  first_shortfall_gap: number | null;
  financing_routes: VerdictFinancingRoute[] | null;
  verdicts: StageVerdict[] | null;
  shortfall_preparation: ShortfallPreparation | null;
  interim_critical_line: InterimCriticalLine | null;
  holds: VerdictHold[] | null;
  /** 공고문 사실 요약 (AI 분석) */
  analysis_summary: string | null;
  risk_clauses: RiskClause[] | null;
}

/**
 * POST /verdicts 요청.
 * 토큰과 user 를 함께 보내면 서버는 토큰을 우선한다. 토큰이 30분 만료라
 * user 를 같이 실어 만료 뒤에도 같은 조건으로 판정되게 한다.
 */
export interface VerdictRequest {
  condition_token?: string;
  user?: UserConditionRequest;
  /** 공고 관리 번호. 없으면 단지 미선택 추정 모드 */
  complex_id?: string;
  /** 주택형 ID. 없으면 대표 주택형 기준 */
  unit_type_id?: string;
  /** 규칙 버전. 미전달 시 최신 버전 */
  rule_version?: string;
}

/** 판정 화면으로 넘길 대상. 평형 선택 시 세션에 적어둔다 */
export interface VerdictTarget {
  complexId: string;
  unitTypeId: string | null;
}
