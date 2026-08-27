/** 청약 공급 유형 */
export type SupplyType = "private" | "public";

/** 진행중인 청약 공고 한 건 */
export interface HousingSubscription {
  id: string;
  supplyType: SupplyType;
  /** 접수 마감일. ISO 날짜(YYYY-MM-DD) */
  deadline: string;
  /** 단지명 */
  name: string;
  address: string;
  /** 분양가. 원 단위 */
  price: number;
}
