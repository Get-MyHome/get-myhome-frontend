/**
 * 청약 공고 요약 정보. GET /complexes 목록 항목.
 * Swagger 문서는 camelCase 로 나오지만 실제 응답은 snake_case 다 — 실측값 기준.
 */
export interface ComplexSummary {
  complex_id: string;
  name: string;
  /** 가능한 값: 민영, 국민, 민간사전청약 등 */
  house_type: string;
  /** 경기 지역은 "경기도"로 표기됨 */
  region: string;
  address: string;
  /** 모집공고일 (YYYY-MM-DD) */
  announcement_date: string;
  /** 청약접수 종료일 (YYYY-MM-DD) */
  application_end_date: string;
  /** 입주예정월 (YYYY년MM월 또는 YYYYMM) */
  expected_move_in: string;
  /** 대표 분양가 (첫 주택형 기준, 만원). 주택형 미등록이면 null */
  sale_price: number | null;
  is_judgeable: boolean;
}

export interface ComplexListResponse {
  items: ComplexSummary[];
  total: number;
  page: number;
  size: number;
  /** 데이터 갱신 시각 (KST, "yyyy-MM-dd HH:mm:ss") */
  updated_at: string;
}

/** 주택 구분 필터. PUBLIC 공공(국민주택) / PRIVATE 민간(민영주택) */
export const HOUSE_CATEGORIES = ["PUBLIC", "PRIVATE"] as const;
export type HouseCategory = (typeof HOUSE_CATEGORIES)[number];

/** 주택형(평형) 하나. GET /complexes/{complexId} 의 unit_types 항목 */
export interface ComplexUnitType {
  unit_type_id: string;
  /** 전용면적 코드. 예: "059.9442A" (전용 59.94㎡ A 타입) */
  type: string;
  /** 분양 최고가 (만원). null 일 수 있음 */
  sale_price: number | null;
  /** 공급면적 (㎡) 문자열 */
  supply_area: string;
}

/** GET /complexes/{complexId} 응답. 목록과 마찬가지로 실제 응답은 snake_case */
export interface ComplexDetail {
  complex_id: string;
  name: string;
  house_type: string;
  region: string;
  address: string;
  /** 모집공고일 (YYYY-MM-DD) */
  announcement_date: string;
  /** 청약접수 종료일 (YYYY-MM-DD) */
  application_end_date: string;
  /** 대표 분양가 (만원). 주택형 미등록이면 null */
  sale_price: number | null;
  unit_types: ComplexUnitType[];
  /** 규제지역 구분. 투기과열지구 / 분양가상한제 / null */
  regulation_zone: string | null;
  /** 청약홈 공고문 URL (항상 존재) */
  source_url: string;
  /** 데이터 갱신 시각 (KST, "yyyy-MM-dd HH:mm:ss") */
  updated_at: string;
}

/** 공급지역 필터. 경기 지역만 "경기도"이고 나머지는 약어 */
export const COMPLEX_REGIONS = [
  "서울",
  "경기도",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
] as const;
export type ComplexRegion = (typeof COMPLEX_REGIONS)[number];
