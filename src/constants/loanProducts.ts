import type { FinancingProductCode } from "@/types/financing";

/**
 * 대출 상품 한 줄 소개. API 에는 없어서 정적으로 둔다.
 * 수치는 기획서 9.2 수치 기준표(2026-08-20) 기준 — 문구·기준일은 기획 확인 필요.
 */
export const LOAN_PRODUCT_DESCRIPTION: Record<FinancingProductCode, string> = {
  DIDIMDOL_GENERAL:
    "무주택 서민을 위한 정부 지원 저리 주택담보대출. 부부합산 연소득 6,000만 원 이하.",
  DIDIMDOL_FIRST:
    "생애최초 주택 구입자 대상 디딤돌. 소득 요건 7,000만 원 이하, LTV·한도 우대.",
  DIDIMDOL_NEWLYWED:
    "혼인 7년 이내·결혼 예정 부부 대상 디딤돌. 합산 8,500만 원 이하, 한도 최대 3.2억.",
  YOUTH_DREAM_SINGLE:
    "청년주택드림 청약통장 가입자 대상. 만 39세 이하, 분양가 6억 원 이하.",
  YOUTH_DREAM_NEWLYWED:
    "청년주택드림 신혼부부형. 배우자 합산 1억 원 이하, 한도 최대 4.0억.",
  BANK_MORTGAGE:
    "시중은행 일반 주택담보대출. 금리는 정책대출보다 높지만 한도가 크고 소득만으로 조회돼요.",
};
