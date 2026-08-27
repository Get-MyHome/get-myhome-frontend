import type { HousingSubscription } from "@/types/subscription";

/** API 연결 전까지 쓰는 더미 데이터 */
export const MOCK_SUBSCRIPTIONS: HousingSubscription[] = [
  {
    id: "hongeun-hillstate",
    supplyType: "private",
    deadline: "2026-09-09",
    name: "홍은동 힐스테이트",
    address: "서울특별시 서대문구 홍은동",
    price: 1_420_000_000,
  },
  {
    id: "lh-woori-jugong",
    supplyType: "public",
    deadline: "2026-09-09",
    name: "LH 우리주공 아파트",
    address: "서울특별시 은평구 우리길",
    price: 1_920_000_000,
  },
  {
    id: "hongeun-hillstate-2",
    supplyType: "private",
    deadline: "2026-09-09",
    name: "홍은동 힐스테이트",
    address: "서울특별시 서대문구 홍은동",
    price: 420_000_000,
  },
  {
    id: "magok-xi",
    supplyType: "private",
    deadline: "2026-10-15",
    name: "마곡 자이르네",
    address: "서울특별시 강서구 마곡동",
    price: 980_000_000,
  },
  {
    id: "jangwi-raemian",
    supplyType: "public",
    deadline: "2026-11-02",
    name: "장위 래미안 포레카운티",
    address: "서울특별시 성북구 장위동",
    price: 760_000_000,
  },
  {
    id: "cheongnyangni-skyl",
    supplyType: "private",
    deadline: "2026-11-20",
    name: "청량리역 롯데캐슬 SKY-L65",
    address: "서울특별시 동대문구 전농동",
    price: 1_150_000_000,
  },
];

/** 목록이 마지막으로 갱신된 날짜 */
export const MOCK_UPDATED_AT = "2026-08-25";
