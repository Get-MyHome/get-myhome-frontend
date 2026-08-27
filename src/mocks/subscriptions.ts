import type { HousingSubscription } from "@/types/subscription";

/**
 * API 연결 전까지 쓰는 더미 데이터.
 * noticeUrl 은 실제 공고문 주소가 아니라 청약홈 대표 주소를 넣어둔 자리표시자다.
 */
const NOTICE_URL_PLACEHOLDER = "https://www.applyhome.co.kr";

export const MOCK_SUBSCRIPTIONS: HousingSubscription[] = [
  {
    id: "hongeun-hillstate",
    supplyType: "private",
    deadline: "2026-09-09",
    name: "홍은동 힐스테이트",
    address: "서울특별시 서대문구 홍은동",
    price: 420_000_000,
    moveInMonth: "2029-06",
    unitTypes: [
      { area: 74, price: 320_000_000 },
      { area: 84, price: 420_000_000 },
      { area: 99, price: 490_000_000 },
    ],
    noticeUrl: NOTICE_URL_PLACEHOLDER,
  },
  {
    id: "lh-woori-jugong",
    supplyType: "public",
    deadline: "2026-09-09",
    name: "LH 우리주공 아파트",
    address: "서울특별시 은평구 우리길",
    price: 1_920_000_000,
    moveInMonth: "2029-11",
    unitTypes: [
      { area: 59, price: 1_480_000_000 },
      { area: 84, price: 1_920_000_000 },
    ],
    noticeUrl: NOTICE_URL_PLACEHOLDER,
  },
  {
    id: "magok-xi",
    supplyType: "private",
    deadline: "2026-10-15",
    name: "마곡 자이르네",
    address: "서울특별시 강서구 마곡동",
    price: 980_000_000,
    moveInMonth: "2028-12",
    unitTypes: [
      { area: 59, price: 780_000_000 },
      { area: 74, price: 890_000_000 },
      { area: 84, price: 980_000_000 },
    ],
    noticeUrl: NOTICE_URL_PLACEHOLDER,
  },
  {
    id: "jangwi-raemian",
    supplyType: "public",
    deadline: "2026-11-02",
    name: "장위 래미안 포레카운티",
    address: "서울특별시 성북구 장위동",
    price: 760_000_000,
    moveInMonth: "2030-03",
    unitTypes: [
      { area: 49, price: 610_000_000 },
      { area: 59, price: 760_000_000 },
    ],
    noticeUrl: NOTICE_URL_PLACEHOLDER,
  },
  {
    id: "cheongnyangni-skyl",
    supplyType: "private",
    deadline: "2026-11-20",
    name: "청량리역 롯데캐슬 SKY-L65",
    address: "서울특별시 동대문구 전농동",
    price: 1_150_000_000,
    moveInMonth: "2029-09",
    unitTypes: [
      { area: 84, price: 1_150_000_000 },
      { area: 101, price: 1_390_000_000 },
    ],
    noticeUrl: NOTICE_URL_PLACEHOLDER,
  },
];

/** 목록이 마지막으로 갱신된 날짜 */
export const MOCK_UPDATED_AT = "2026-08-25";

export function findSubscription(id: string): HousingSubscription | undefined {
  return MOCK_SUBSCRIPTIONS.find((subscription) => subscription.id === id);
}
