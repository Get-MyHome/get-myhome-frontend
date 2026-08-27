/** 청약 공급 유형 */
export type SupplyType = "private" | "public";

/** 주택형(평형) 하나 */
export interface UnitType {
  /** 전용면적 (㎡) */
  area: number;
  /** 분양가. 원 단위 */
  price: number;
}

/** 진행중인 청약 공고 한 건 */
export interface HousingSubscription {
  id: string;
  supplyType: SupplyType;
  /** 접수 마감일. ISO 날짜(YYYY-MM-DD) */
  deadline: string;
  /** 단지명 */
  name: string;
  address: string;
  /** 대표 분양가. 원 단위 */
  price: number;
  /** 입주 예정. ISO 연월(YYYY-MM) */
  moveInMonth: string;
  /** 주택형별 분양가 */
  unitTypes: UnitType[];
  /** 원문 공고문 링크. 자체 재배포 없이 원문만 연결한다 */
  noticeUrl: string;
}
